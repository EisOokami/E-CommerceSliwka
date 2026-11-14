import { and, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { carts, products, users } from "../db/schema.js";
import { cartsQuery } from "../query/carts.query.js";
import { type QueryInput } from "../types/query.js";
import { ApiError } from "../utils/apiError.js";
import { buildQuery } from "../utils/query/queryBuilder.js";

export const getCarts = async (
    userId: string,
    query: QueryInput<typeof cartsQuery.config>,
    id?: string,
) => {
    const args = buildQuery(query, cartsQuery);

    return db.query.carts.findMany({
        ...args,
        where: and(
            eq(carts.userId, userId),
            id ? eq(carts.id, id) : undefined,
            args.where,
        ),
    });
};

export const getCart = async (
    userId: string,
    query: QueryInput<typeof cartsQuery.config>,
    id: string,
) => {
    const args = buildQuery(query, cartsQuery);

    return db.query.carts.findFirst({
        ...(args.with ? { with: args.with } : {}),
        ...(args.orderBy ? { orderBy: args.orderBy } : {}),
        where: and(
            eq(carts.userId, userId),
            id ? eq(carts.id, id) : undefined,
            args.where,
        ),
    });
};

export const createCart = async (
    userId: string,
    data: { quantity: number; productId: string },
) => {
    const { productId, quantity } = data;

    return await db.transaction(async (tx) => {
        const [user] = await tx
            .select({ id: users.id, blocked: users.blocked })
            .from(users)
            .where(eq(users.id, userId))
            .for("update");

        if (!user || user.blocked) {
            throw new ApiError({ statusCode: 403, message: "Access denied" });
        }

        const [product] = await tx
            .select()
            .from(products)
            .where(eq(products.id, productId))
            .for("update");

        if (
            !product ||
            product.visibility !== "visible" ||
            !product.inStock ||
            product.quantity < quantity
        ) {
            throw new ApiError({
                statusCode: 409,
                message:
                    "Product is unavailable or requested quantity exceeds stock",
            });
        }

        const [duplicate] = await tx
            .select({ id: carts.id })
            .from(carts)
            .where(
                and(eq(carts.userId, userId), eq(carts.productId, productId)),
            );

        if (duplicate) {
            throw new ApiError({
                statusCode: 409,
                message: "Product is already in your cart",
            });
        }

        return tx
            .insert(carts)
            .values({ userId, productId, quantity })
            .returning({ id: carts.id });
    });
};

export const updateCart = async (
    userId: string,
    id: string,
    _query: QueryInput<typeof cartsQuery.config>,
    data: { quantity?: number },
) => {
    return await db.transaction(async (tx) => {
        const [user] = await tx
            .select({ id: users.id, blocked: users.blocked })
            .from(users)
            .where(eq(users.id, userId))
            .for("update");

        if (!user || user.blocked) {
            throw new ApiError({ statusCode: 403, message: "Access denied" });
        }

        const [existing] = await tx
            .select()
            .from(carts)
            .where(and(eq(carts.id, id), eq(carts.userId, userId)));

        if (!existing) {
            throw new ApiError({
                statusCode: 404,
                message: "Cart item not found",
            });
        }

        const quantity = data.quantity ?? existing.quantity;

        const [product] = await tx
            .select()
            .from(products)
            .where(eq(products.id, existing.productId))
            .for("update");

        if (
            !product ||
            product.visibility !== "visible" ||
            !product.inStock ||
            product.quantity < quantity
        ) {
            throw new ApiError({
                statusCode: 409,
                message:
                    "Product is unavailable or requested quantity exceeds stock",
            });
        }

        return tx
            .update(carts)
            .set({ quantity, updatedAt: new Date() })
            .where(and(eq(carts.id, id), eq(carts.userId, userId)))
            .returning({ id: carts.id });
    });
};

export const deleteCart = async (userId: string, id: string) => {
    const result = await db
        .delete(carts)
        .where(and(eq(carts.id, id), eq(carts.userId, userId)))
        .returning({ id: carts.id });

    if (!result.length) {
        throw new ApiError({ statusCode: 404, message: "Cart item not found" });
    }

    return true;
};
