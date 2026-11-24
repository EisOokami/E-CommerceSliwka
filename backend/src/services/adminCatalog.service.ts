import { and, inArray, asc, count, desc, eq, ilike, sql } from "drizzle-orm";
import { type z } from "zod";
import { db } from "../db/index.js";
import {
    categories,
    coupons,
    files,
    products,
    reviews,
    users,
} from "../db/schema.js";
import { type IAdminRequest } from "../types/types.js";
import { ApiError } from "../utils/apiError.js";
import { releaseFiles } from "./fileRelease.service.js";
import {
    catalogListSchema,
    categorySchema,
    couponSchema,
    reviewModerationSchema,
    type CatalogResource,
} from "../validators/adminCatalog.js";
import * as adminPanelService from "./adminPanel.service.js";
import * as auditService from "./audit.service.js";

const actions = {
    categories: {
        create: "CATEGORY_CREATED",
        update: "CATEGORY_UPDATED",
        delete: "CATEGORY_DELETED",
    },
    reviews: {
        create: "REVIEW_UPDATED",
        update: "REVIEW_UPDATED",
        delete: "REVIEW_DELETED",
    },
    coupons: {
        create: "COUPON_CREATED",
        update: "COUPON_UPDATED",
        delete: "COUPON_DELETED",
    },
} as const;

export const detail = async (resource: CatalogResource, id: string) => {
    const result = await list(resource, catalogListSchema.parse({}), id);

    if (!result.data[0]) {
        throw new ApiError({
            statusCode: 404,
            message: "Catalog list not found",
        });
    }

    return result.data[0];
};

export const mutate = async (
    resource: CatalogResource,
    operation: "create" | "update" | "delete",
    id: string | undefined,
    body: unknown,
    req: IAdminRequest,
) => {
    return await db.transaction(async (tx) => {
        const actor = await adminPanelService.authorize(
            tx,
            req,
            resource + "." + operation,
            operation === "delete" || resource === "coupons",
        );

        let entityId = id;

        if (resource === "categories") {
            const validateData = categorySchema.parse(body);

            let category = undefined;

            if (id) {
                category = (
                    await tx
                        .select()
                        .from(categories)
                        .where(eq(categories.id, id))
                        .for("update")
                )[0];
            }

            if (id && !category) {
                throw new ApiError({
                    statusCode: 404,
                    message: "Category not found",
                });
            }

            if (category) {
                const categoryUsed = !!(await tx.query.products.findFirst({
                    columns: {
                        id: true,
                    },
                    where: eq(products.category, category.name),
                }));

                if (operation === "delete" && categoryUsed) {
                    throw new ApiError({
                        statusCode: 409,
                        message:
                            "Reassign products before deleting this category",
                    });
                }
            }

            if (operation === "delete" && id) {
                await tx.delete(categories).where(eq(categories.id, id));
            }

            if (operation === "update" && id) {
                const [savedCategory] = await tx
                    .update(categories)
                    .set({ ...validateData, updatedAt: new Date() })
                    .where(eq(categories.id, id))
                    .returning();

                if (!savedCategory) {
                    throw new ApiError({
                        statusCode: 404,
                        message: "Category not found",
                    });
                }

                entityId = savedCategory.id;
            }

            if (operation === "create" && !id) {
                const [savedCategory] = await tx
                    .insert(categories)
                    .values(validateData)
                    .returning();

                if (!savedCategory) {
                    throw new ApiError({
                        statusCode: 404,
                        message: "Category not found",
                    });
                }

                entityId = savedCategory.id;
            }
        }

        if (resource === "coupons") {
            let coupon = undefined;

            if (id) {
                coupon = (
                    await tx
                        .select({ id: coupons.id })
                        .from(coupons)
                        .where(eq(coupons.id, id))
                        .for("update")
                )[0];
            }

            if (id && !coupon) {
                throw new ApiError({
                    statusCode: 404,
                    message: "Coupon ot found",
                });
            }

            if (operation === "delete" && id) {
                await tx.delete(coupons).where(eq(coupons.id, id));
            }

            if (operation === "update" && id) {
                const data = couponSchema.parse(body);

                const [savedCoupon] = await tx
                    .update(coupons)
                    .set({
                        ...data,
                        expiresAt: data.expiresAt
                            ? new Date(data.expiresAt)
                            : null,
                        updatedAt: new Date(),
                    })
                    .where(eq(coupons.id, id))
                    .returning();

                if (!savedCoupon) {
                    throw new ApiError({
                        statusCode: 404,
                        message: "Coupon not found",
                    });
                }

                entityId = savedCoupon.id;
            }

            if (operation === "create" && !id) {
                const data = couponSchema.parse(body);

                const [savedCoupon] = await tx
                    .insert(coupons)
                    .values({
                        ...data,
                        expiresAt: data.expiresAt
                            ? new Date(data.expiresAt)
                            : null,
                    })
                    .returning();

                if (!savedCoupon) {
                    throw new ApiError({
                        statusCode: 404,
                        message: "Coupon not found",
                    });
                }

                entityId = savedCoupon.id;
            }
        }

        if (resource === "reviews") {
            const validateData = reviewModerationSchema.parse(body);

            let review = undefined;

            if (id) {
                review = (
                    await tx.select().from(reviews).where(eq(reviews.id, id))
                )[0];
            }

            if (id && !review) {
                throw new ApiError({
                    statusCode: 404,
                    message: "Review not found",
                });
            }

            if (id && review) {
                await tx
                    .select()
                    .from(products)
                    .where(eq(products.id, review.productId))
                    .for("update");

                const lockedReview = !!(
                    await tx
                        .select()
                        .from(reviews)
                        .where(eq(reviews.id, id))
                        .for("update")
                )[0];

                if (!lockedReview) {
                    throw new ApiError({
                        statusCode: 404,
                        message: "Review not found",
                    });
                }
            }

            if (operation === "delete" && id) {
                const photos = await tx
                    .select({ id: files.id })
                    .from(files)
                    .where(eq(files.reviewId, id));

                await releaseFiles(
                    tx,
                    photos.map((photo) => photo.id),
                );

                await tx.delete(reviews).where(eq(reviews.id, id));
            }

            if (operation === "update" && id) {
                await tx
                    .update(reviews)
                    .set({
                        visible: validateData.visible,
                        updatedAt: new Date(),
                    })
                    .where(eq(reviews.id, id));
            }

            if (review) {
                await tx
                    .update(products)
                    .set({
                        averageRating: sql`(select coalesce(round(avg(rating)::numeric,1),0) from reviews where product_id=${review.productId} and visible=true)`,
                        updatedAt: new Date(),
                    })
                    .where(eq(products.id, review.productId));
            }
        }

        await auditService.insertAudit(tx, {
            adminId: actor.id,
            action: actions[resource][operation],
            entity: resource,
            entityId: entityId,
            ip: req.ip,
            userAgent: req.get("user-agent"),
        });

        return { id: entityId };
    });
};

export const list = async (
    resource: CatalogResource,
    input: z.infer<typeof catalogListSchema>,
    id?: string,
) => {
    const table = { categories, coupons, reviews }[resource];
    const column =
        resource === "categories"
            ? categories.name
            : resource === "coupons"
              ? coupons.code
              : reviews.description;
    const search = input.search.replace(/[\\%_]/g, "\\$&");
    const where = and(
        id ? eq(table.id, id) : undefined,
        search ? ilike(column, `%${search}%`) : undefined,
        resource === "reviews" && input.status
            ? eq(reviews.visible, input.status === "visible")
            : resource === "coupons" && input.status
              ? eq(coupons.enabled, input.status === "enabled")
              : undefined,
    );
    const order = (input.direction === "asc" ? asc : desc)(
        input.sort === "name" ? column : table.createdAt,
    );

    const data = await db
        .select()
        .from(table)
        .where(where)
        .orderBy(order, asc(table.id))
        .limit(input.pageSize)
        .offset((input.page - 1) * input.pageSize);

    const [countData] = await db
        .select({ total: count() })
        .from(table)
        .where(where);

    if (typeof countData === "undefined") {
        throw new ApiError({
            statusCode: 500,
            message: "Failed to fetch records count from the database",
        });
    }

    if (resource === "reviews") {
        const rows = await db
            .select({
                id: reviews.id,
                description: reviews.description,
                rating: reviews.rating,
                visible: reviews.visible,
                productId: reviews.productId,
                userId: reviews.userId,
                productName: products.name,
                userName: users.username,
                createdAt: reviews.createdAt,
            })
            .from(reviews)
            .innerJoin(products, eq(reviews.productId, products.id))
            .innerJoin(users, eq(reviews.userId, users.id))
            .where(where)
            .orderBy(order, asc(reviews.id))
            .limit(input.pageSize)
            .offset((input.page - 1) * input.pageSize);

        return {
            data: rows,
            total: countData.total,
            page: input.page,
            pageSize: input.pageSize,
        };
    }

    return {
        data,
        total: countData.total,
        page: input.page,
        pageSize: input.pageSize,
    };
};

export const categoryList = async () => {
    const categoryData = await db.query.categories.findMany({
        orderBy: asc(categories.name),
    });

    return categoryData;
};

export const existingAiProductSlugs = async (slugs: string[]) => {
    if (!slugs.length) {
        return new Set<string>();
    }

    const rows = await db
        .select({ slug: products.slug })
        .from(products)
        .where(inArray(products.slug, [...new Set(slugs)].slice(0, 630)));

    return new Set(rows.map((row) => row.slug));
};
