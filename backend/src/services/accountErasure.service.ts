import { and, asc, eq, inArray, or, sql } from "drizzle-orm";
import {
    carts,
    couponRedemptions,
    files,
    loginAttempts,
    mfaBackupCodes,
    mfaLoginSessions,
    oauthExchangeCodes,
    orders,
    products,
    reviews,
    userSessions,
    users,
    wishlists,
} from "../db/schema.js";
import type { DatabaseTransaction } from "../types/database.js";
import { releaseFiles } from "./fileRelease.service.js";
import { paymentGateway } from "./paymentGateway.service.js";

export const eraseUser = async (tx: DatabaseTransaction, userId: string) => {
    const [user] = await tx
        .select({
            id: users.id,
            email: users.email,
            pendingEmail: users.pendingEmail,
            avatarId: users.avatarId,
        })
        .from(users)
        .where(eq(users.id, userId))
        .for("update");

    if (!user) {
        return undefined;
    }

    const reservedOrders = await tx
        .select({
            id: orders.id,
            stripeId: orders.stripeId,
            cartItems: orders.cartItems,
        })
        .from(orders)
        .where(and(eq(orders.userId, userId), eq(orders.stockReserved, true)))
        .orderBy(asc(orders.id))
        .for("update");

    const restock = new Map<string, number>();

    for (const order of reservedOrders) {
        for (const item of order.cartItems) {
            restock.set(
                item.product.id,
                (restock.get(item.product.id) ?? 0) + item.quantity,
            );
        }
    }

    const userReviews = await tx
        .select({ id: reviews.id, productId: reviews.productId })
        .from(reviews)
        .where(eq(reviews.userId, userId));

    const reviewIds = userReviews.map((review) => review.id);
    const touchedProducts = [
        ...new Set([
            ...restock.keys(),
            ...userReviews.map((review) => review.productId),
        ]),
    ].sort();

    if (touchedProducts.length) {
        await tx
            .select({ id: products.id })
            .from(products)
            .where(inArray(products.id, touchedProducts))
            .orderBy(asc(products.id))
            .for("update");
    }

    for (const [productId, quantity] of [...restock].sort(([a], [b]) =>
        a.localeCompare(b),
    )) {
        await tx
            .update(products)
            .set({
                quantity: sql`${products.quantity} + ${quantity}`,
                inStock: true,
                updatedAt: new Date(),
            })
            .where(eq(products.id, productId));
    }

    await tx
        .update(users)
        .set({ avatarId: null, avatarUrl: null })
        .where(eq(users.id, userId));

    const ownedFiles = await tx
        .select({ id: files.id })
        .from(files)
        .where(
            or(
                eq(files.uploaderId, userId),
                reviewIds.length
                    ? inArray(files.reviewId, reviewIds)
                    : undefined,
                user.avatarId ? eq(files.id, user.avatarId) : undefined,
            ),
        );

    await releaseFiles(
        tx,
        ownedFiles.map((file) => file.id),
        { exceptAvatarOf: userId },
    );

    if (reviewIds.length) {
        await tx.delete(reviews).where(inArray(reviews.id, reviewIds));

        for (const productId of [
            ...new Set(userReviews.map((review) => review.productId)),
        ].sort()) {
            await tx
                .update(products)
                .set({
                    averageRating: sql`(select coalesce(round(avg(rating)::numeric,1),0) from reviews where product_id=${productId} and visible=true)`,
                    updatedAt: new Date(),
                })
                .where(eq(products.id, productId));
        }
    }

    await tx
        .delete(couponRedemptions)
        .where(eq(couponRedemptions.userId, userId));
    await tx.delete(carts).where(eq(carts.userId, userId));
    await tx.delete(wishlists).where(eq(wishlists.userId, userId));
    await tx.delete(orders).where(eq(orders.userId, userId));
    await tx.delete(userSessions).where(eq(userSessions.userId, userId));
    await tx.delete(mfaBackupCodes).where(eq(mfaBackupCodes.userId, userId));
    await tx
        .delete(mfaLoginSessions)
        .where(eq(mfaLoginSessions.userId, userId));
    await tx
        .delete(oauthExchangeCodes)
        .where(eq(oauthExchangeCodes.userId, userId));
    await tx.delete(loginAttempts).where(
        inArray(
            loginAttempts.email,
            [user.email, user.pendingEmail].filter(
                (email): email is string => !!email,
            ),
        ),
    );
    await tx.delete(users).where(eq(users.id, userId));

    return {
        openCheckoutSessions: reservedOrders.map((order) => order.stripeId),
    };
};

export const expireCheckoutSessions = async (sessionIds: string[]) => {
    const results = await Promise.allSettled(
        sessionIds.map((id) => paymentGateway.expire(id)),
    );

    if (results.some((result) => result.status === "rejected")) {
        console.error(
            "Some checkout sessions of a deleted account could not be expired",
        );
    }
};
