import { and, count, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { products, users, wishlists } from "../db/schema.js";
import { wishlistsQuery } from "../query/wishlists.query.js";
import { type QueryInput } from "../types/query.js";
import { ApiError } from "../utils/apiError.js";
import { buildQuery } from "../utils/query/queryBuilder.js";

export const getWishlists = async (
    userId: string,
    query: QueryInput<typeof wishlistsQuery.config>,
) => {
    const queryArgs = buildQuery(query, wishlistsQuery);

    const wishlistsData = await db.query.wishlists.findMany({
        ...queryArgs,
        where: and(eq(wishlists.userId, userId), queryArgs.where),
    });

    return wishlistsData;
};

export const createWishlist = async (
    userId: string,
    data: Omit<typeof wishlists.$inferInsert, "userId">,
) => {
    const productId = data.productId;

    if (!productId) {
        throw new ApiError({
            statusCode: 400,
            message: "Product ID is required",
        });
    }

    return await db.transaction(async (tx) => {
        const [user] = await tx
            .select({ blocked: users.blocked })
            .from(users)
            .where(eq(users.id, userId))
            .for("update");

        if (!user || user.blocked) {
            throw new ApiError({ statusCode: 403, message: "Access denied" });
        }

        const [product] = await tx
            .select({ visibility: products.visibility })
            .from(products)
            .where(eq(products.id, productId))
            .for("share");

        if (!product || product.visibility !== "visible") {
            throw new ApiError({
                statusCode: 404,
                message: "Product not found",
            });
        }

        const [existing] = await tx
            .select({ id: wishlists.id })
            .from(wishlists)
            .where(
                and(
                    eq(wishlists.userId, userId),
                    eq(wishlists.productId, productId),
                ),
            );

        if (existing) {
            throw new ApiError({
                statusCode: 409,
                message: "Product is already in your wishlist",
            });
        }

        return tx
            .insert(wishlists)
            .values({ productId, userId })
            .returning({ id: wishlists.id });
    });
};

export const deleteWishlist = async (userId: string, wishlistId: string) => {
    const response = await db
        .delete(wishlists)
        .where(and(eq(wishlists.userId, userId), eq(wishlists.id, wishlistId)));

    return response.rowCount !== 0 ? true : false;
};

export const getWishlistsCount = async (userId: string) => {
    const response = await db
        .select({ count: count(wishlists.id) })
        .from(wishlists)
        .where(eq(wishlists.userId, userId));

    return response;
};
