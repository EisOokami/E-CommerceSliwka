import { and, asc, eq, inArray, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import {
    files,
    optionDetails,
    options,
    orders,
    productInfos,
    productSpecificationGroups,
    productSpecifications,
    productVariants,
    products,
    specifications,
} from "../db/schema.js";
import { type DatabaseTransaction } from "../types/database.js";
import { ApiError } from "../utils/apiError.js";
import { type ProductRelationsInput } from "../validators/adminCatalog.js";
import { moneyUnits } from "../utils/moneyUnits.js";
import { productSchema } from "../validators/adminPanel.js";
import * as adminImagesService from "./adminImages.service.js";

export const productDetail = (id: string) =>
    db.query.products.findFirst({
        where: eq(products.id, id),
        with: {
            image: true,
            sliderImages: { orderBy: asc(files.sortOrder) },
            productVariants: true,
            options: { with: { optionDetails: true } },
            productInfos: true,
            productSpecifications: true,
            productSpecificationGroups: { with: { specifications: true } },
        },
    });

export const mutateProduct = async (
    tx: DatabaseTransaction,
    operation: "create" | "update" | "delete",
    id: string | undefined,
    parsed: unknown,
) => {
    let entityId = id;

    if (operation === "delete" && id) {
        const [product] = await tx
            .select()
            .from(products)
            .where(eq(products.id, id))
            .for("update");

        if (!product) {
            throw new ApiError({ statusCode: 404, message: "Not found" });
        }

        const hasProductOrders = !!(await tx.query.orders.findFirst({
            columns: {
                id: true,
            },
            where: sql`exists (select 1 from jsonb_array_elements(${orders.cartItems}) item where item->'product'->>'id' = ${id})`,
        }));

        if (hasProductOrders) {
            throw new ApiError({
                statusCode: 409,
                message:
                    "Products referenced by orders must be hidden instead of deleted",
            });
        }

        const input: ProductRelationsInput = {
            galleryIds: [],
            productVariants: [],
            options: [],
            productInfos: [],
            productSpecifications: [],
            productSpecificationGroups: [],
        };

        if (input.galleryIds) {
            await tx
                .update(files)
                .set({ productId: null, imageRole: null })
                .where(
                    and(eq(files.productId, id), eq(files.imageRole, "slider")),
                );

            for (const [sortOrder, fileId] of input.galleryIds.entries()) {
                await tx
                    .update(files)
                    .set({ productId: id, imageRole: "slider", sortOrder })
                    .where(eq(files.id, fileId));
            }
        }

        if (input.productVariants) {
            await tx
                .delete(productVariants)
                .where(eq(productVariants.productId, id));

            if (input.productVariants.length) {
                await tx.insert(productVariants).values(
                    input.productVariants.map((productVariant) => ({
                        ...productVariant,
                        productId: id,
                    })),
                );
            }
        }

        if (input.productInfos) {
            await tx.delete(productInfos).where(eq(productInfos.productId, id));

            if (input.productInfos.length) {
                await tx.insert(productInfos).values(
                    input.productInfos.map((productInfo) => ({
                        ...productInfo,
                        productId: id,
                    })),
                );
            }
        }

        if (input.productSpecifications) {
            await tx
                .delete(productSpecifications)
                .where(eq(productSpecifications.productId, id));

            if (input.productSpecifications.length) {
                await tx.insert(productSpecifications).values(
                    input.productSpecifications.map((productSpecification) => ({
                        ...productSpecification,
                        productId: id,
                    })),
                );
            }
        }

        if (input.options) {
            const optionsData = await tx
                .select({ id: options.id })
                .from(options)
                .where(eq(options.productId, id));

            if (optionsData.length) {
                await tx.delete(optionDetails).where(
                    inArray(
                        optionDetails.optionId,
                        optionsData.map((option) => option.id),
                    ),
                );
            }

            await tx.delete(options).where(eq(options.productId, id));

            for (const { optionDetails: details, ...value } of input.options) {
                const [row] = await tx
                    .insert(options)
                    .values({ ...value, productId: id })
                    .returning();

                if (!row) {
                    throw new ApiError({
                        statusCode: 500,
                        message: "Failed to save product option",
                    });
                }

                if (details.length) {
                    await tx.insert(optionDetails).values(
                        details.map((detail) => ({
                            ...detail,
                            optionId: row.id,
                        })),
                    );
                }
            }
        }

        if (input.productSpecificationGroups) {
            const productSpecificationGroupsData = await tx
                .select({ id: productSpecificationGroups.id })
                .from(productSpecificationGroups)
                .where(eq(productSpecificationGroups.productId, id));

            if (productSpecificationGroupsData.length) {
                await tx.delete(specifications).where(
                    inArray(
                        specifications.productSpecificationGroupId,
                        productSpecificationGroupsData.map(
                            (productSpecificationGroup) =>
                                productSpecificationGroup.id,
                        ),
                    ),
                );
            }

            await tx
                .delete(productSpecificationGroups)
                .where(eq(productSpecificationGroups.productId, id));

            for (const {
                specifications: details,
                ...value
            } of input.productSpecificationGroups) {
                const [row] = await tx
                    .insert(productSpecificationGroups)
                    .values({ ...value, productId: id })
                    .returning();

                if (!row) {
                    throw new ApiError({
                        statusCode: 500,
                        message: "Failed to save product specification group",
                    });
                }

                if (details.length) {
                    await tx.insert(specifications).values(
                        details.map((detail) => ({
                            ...detail,
                            productSpecificationGroupId: row.id,
                        })),
                    );
                }
            }
        }

        await tx
            .update(files)
            .set({ productId: null, imageRole: null })
            .where(eq(files.productId, id));

        const [deletedProduct] = await tx
            .delete(products)
            .where(eq(products.id, id))
            .returning({ id: products.id });

        if (!deletedProduct) {
            throw new ApiError({
                statusCode: 404,
                message: "Product not found",
            });
        }
    }

    if (operation !== "delete") {
        const input = productSchema.parse(parsed);

        if (input.galleryIds && input.galleryIds.includes(input.imageId)) {
            throw new ApiError({
                statusCode: 400,
                message: "Main image must not also be in the gallery",
            });
        }

        let product = undefined;

        if (id) {
            product = (
                await tx
                    .select()
                    .from(products)
                    .where(eq(products.id, id))
                    .for("update")
            )[0];
        }

        if (id && !product) {
            throw new ApiError({ statusCode: 404, message: "Not found" });
        }

        for (const fileId of [
            ...new Set([input.imageId, ...(input.galleryIds ?? [])]),
        ].sort()) {
            const file = await adminImagesService.lockFile(tx, fileId);

            if (
                !file ||
                file.reviewId ||
                file.uploaderId ||
                (file.productId && file.productId !== id)
            ) {
                throw new ApiError({
                    statusCode: 409,
                    message: "Image unavailable or belongs to another record",
                });
            }
        }

        if (
            input.isDiscount &&
            moneyUnits(input.discountedPrice) > moneyUnits(input.price)
        ) {
            throw new ApiError({
                statusCode: 400,
                message: "Discount price must not exceed price",
            });
        }

        const [row] = id
            ? await tx
                  .update(products)
                  .set({
                      ...input,
                      inStock: input.quantity > 0,
                      finalPrice: input.isDiscount
                          ? input.discountedPrice
                          : input.price,
                      updatedAt: new Date(),
                  })
                  .where(eq(products.id, id))
                  .returning({ id: products.id })
            : await tx
                  .insert(products)
                  .values({
                      ...input,
                      inStock: input.quantity > 0,
                      finalPrice: input.isDiscount
                          ? input.discountedPrice
                          : input.price,
                      updatedAt: new Date(),
                  })
                  .returning({ id: products.id });

        if (!row) {
            throw new ApiError({ statusCode: 404, message: "Not found" });
        }

        entityId = row.id;

        if (input.galleryIds) {
            await tx
                .update(files)
                .set({ productId: null, imageRole: null })
                .where(
                    and(
                        eq(files.productId, row.id),
                        eq(files.imageRole, "slider"),
                    ),
                );

            for (const [sortOrder, fileId] of input.galleryIds.entries()) {
                await tx
                    .update(files)
                    .set({ productId: id, imageRole: "slider", sortOrder })
                    .where(eq(files.id, fileId));
            }
        }

        if (input.productVariants) {
            await tx
                .delete(productVariants)
                .where(eq(productVariants.productId, row.id));

            if (input.productVariants.length) {
                await tx.insert(productVariants).values(
                    input.productVariants.map((productVariant) => ({
                        ...productVariant,
                        productId: row.id,
                    })),
                );
            }
        }

        if (input.productInfos) {
            await tx
                .delete(productInfos)
                .where(eq(productInfos.productId, row.id));

            if (input.productInfos.length) {
                await tx.insert(productInfos).values(
                    input.productInfos.map((productInfo) => ({
                        ...productInfo,
                        productId: row.id,
                    })),
                );
            }
        }

        if (input.productSpecifications) {
            await tx
                .delete(productSpecifications)
                .where(eq(productSpecifications.productId, row.id));

            if (input.productSpecifications.length) {
                await tx.insert(productSpecifications).values(
                    input.productSpecifications.map((productSpecification) => ({
                        ...productSpecification,
                        productId: row.id,
                    })),
                );
            }
        }

        if (input.options) {
            const optionsData = await tx
                .select({ id: options.id })
                .from(options)
                .where(eq(options.productId, row.id));

            if (optionsData.length) {
                await tx.delete(optionDetails).where(
                    inArray(
                        optionDetails.optionId,
                        optionsData.map((option) => option.id),
                    ),
                );
            }

            await tx.delete(options).where(eq(options.productId, row.id));

            for (const { optionDetails: details, ...value } of input.options) {
                const [optionsData] = await tx
                    .insert(options)
                    .values({ ...value, productId: row.id })
                    .returning();

                if (!optionsData) {
                    throw new ApiError({
                        statusCode: 500,
                        message: "Failed to save product option",
                    });
                }

                if (details.length) {
                    await tx.insert(optionDetails).values(
                        details.map((detail) => ({
                            ...detail,
                            optionId: optionsData.id,
                        })),
                    );
                }
            }
        }

        if (input.productSpecificationGroups) {
            const productSpecificationGroupsData = await tx
                .select({ id: productSpecificationGroups.id })
                .from(productSpecificationGroups)
                .where(eq(productSpecificationGroups.productId, row.id));

            if (productSpecificationGroupsData.length) {
                await tx.delete(specifications).where(
                    inArray(
                        specifications.productSpecificationGroupId,
                        productSpecificationGroupsData.map(
                            (productSpecificationGroup) =>
                                productSpecificationGroup.id,
                        ),
                    ),
                );
            }

            await tx
                .delete(productSpecificationGroups)
                .where(eq(productSpecificationGroups.productId, row.id));

            for (const {
                specifications: details,
                ...value
            } of input.productSpecificationGroups) {
                const [productSpecificationGroupsData] = await tx
                    .insert(productSpecificationGroups)
                    .values({ ...value, productId: row.id })
                    .returning();

                if (!productSpecificationGroupsData) {
                    throw new ApiError({
                        statusCode: 500,
                        message: "Failed to save product specification group",
                    });
                }

                if (details.length) {
                    await tx.insert(specifications).values(
                        details.map((detail) => ({
                            ...detail,
                            productSpecificationGroupId:
                                productSpecificationGroupsData.id,
                        })),
                    );
                }
            }
        }
    }

    return entityId;
};
