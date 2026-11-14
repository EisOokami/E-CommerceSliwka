import { and, eq, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { files, orders, products, reviews } from "../db/schema.js";
import { reviewsQuery } from "../query/reviews.query.js";
import { type QueryInput } from "../types/query.js";
import { ApiError } from "../utils/apiError.js";
import { buildQuery } from "../utils/query/queryBuilder.js";

export const getReviews = async (
    query: QueryInput<typeof reviewsQuery.config>,
) => {
    const args = buildQuery(query, reviewsQuery);

    return await db.query.reviews.findMany({
        ...args,
        where: and(args.where, eq(reviews.visible, true)),
    });
};

export const createReview = async (
    userId: string,
    data: { rating: number; productId: string; description: string },
) => {
    const purchasedProduct = await db.query.orders.findFirst({
        columns: {
            id: true,
        },
        where: and(
            eq(orders.userId, userId),
            eq(orders.isSuccess, true),
            eq(orders.deliveryStatus, "Delivered"),
            sql`exists(select 1 from jsonb_array_elements(${orders.cartItems}) item where item->'product'->>'id'=${data.productId})`,
        ),
    });

    if (!purchasedProduct) {
        throw new ApiError({
            statusCode: 403,
            message: "You can only review products you have purchased",
        });
    }

    return await db.transaction(async (tx) => {
        await tx
            .select({ id: products.id })
            .from(products)
            .where(eq(products.id, data.productId))
            .for("update");

        const [row] = await tx
            .insert(reviews)
            .values({
                userId,
                productId: data.productId,
                description: data.description,
                rating: data.rating,
                publicationDate: new Date().toISOString(),
            })
            .returning({ id: reviews.id, productId: reviews.productId });

        if (row) {
            await tx
                .update(products)
                .set({
                    averageRating: sql`(select coalesce(round(avg(rating)::numeric,1),0) from reviews where product_id=${data.productId} and visible=true)`,
                    updatedAt: new Date(),
                })
                .where(eq(products.id, data.productId));
        }

        return [row];
    });
};

export const updateReview = async (
    userId: string,
    id: string,
    _query: QueryInput<typeof reviewsQuery.config>,
    data: { rating?: number; description?: string },
) => {
    const [review] = await db
        .select()
        .from(reviews)
        .where(and(eq(reviews.id, id), eq(reviews.userId, userId)));

    if (!review) {
        throw new ApiError({ statusCode: 404, message: "Review not found" });
    }

    let result = undefined;

    await db.transaction(async (tx) => {
        await tx
            .select({ id: products.id })
            .from(products)
            .where(eq(products.id, review.productId))
            .for("update");

        const row = await tx
            .update(reviews)
            .set({
                ...data,
                lastEdited: new Date().toISOString(),
                updatedAt: new Date(),
            })
            .where(and(eq(reviews.id, id), eq(reviews.userId, userId)))
            .returning({ id: reviews.id, productId: reviews.productId });

        if (row) {
            await tx
                .update(products)
                .set({
                    averageRating: sql`(select coalesce(round(avg(rating)::numeric,1),0) from reviews where product_id=${review.productId} and visible=true)`,
                    updatedAt: new Date(),
                })
                .where(eq(products.id, review.productId));
        }

        result = row;
    });

    if (!result) {
        throw new ApiError({ statusCode: 404, message: "Review not found" });
    }

    return result;
};

export const deleteReview = async (userId: string, id: string) => {
    const [review] = await db
        .select()
        .from(reviews)
        .where(and(eq(reviews.id, id), eq(reviews.userId, userId)));

    if (!review) {
        throw new ApiError({ statusCode: 404, message: "Review not found" });
    }

    let result = undefined;

    await db.transaction(async (tx) => {
        await tx
            .select({ id: products.id })
            .from(products)
            .where(eq(products.id, review.productId))
            .for("update");

        await tx
            .update(files)
            .set({ reviewId: null })
            .where(and(eq(files.reviewId, id), eq(files.uploaderId, userId)));

        const row = await tx
            .delete(reviews)
            .where(and(eq(reviews.id, id), eq(reviews.userId, userId)))
            .returning({ id: reviews.id, productId: reviews.productId });

        if (row) {
            await tx
                .update(products)
                .set({
                    averageRating: sql`(select coalesce(round(avg(rating)::numeric,1),0) from reviews where product_id=${review.productId} and visible=true)`,
                    updatedAt: new Date(),
                })
                .where(eq(products.id, review.productId));
        }

        result = row;
    });

    if (!result) {
        throw new ApiError({ statusCode: 404, message: "Review not found" });
    }

    return true;
};
