import { and, asc, count, eq, inArray, isNull, sql } from "drizzle-orm";
import { randomBytes } from "node:crypto";
import { type z } from "zod";
import { db } from "../db/index.js";
import {
    carts,
    couponRedemptions,
    coupons,
    orders,
    products,
    users,
} from "../db/schema.js";
import { ordersQuery } from "../query/orders.query.js";
import { type QueryInput } from "../types/query.js";
import { ApiError } from "../utils/apiError.js";
import { buildQuery } from "../utils/query/queryBuilder.js";
import { type orderInsertSchema } from "../validators/orders.js";
import { paymentGateway } from "./paymentGateway.service.js";
import type { PaymentGateway } from "../types/types.js";

export const pendingCheckouts = async () => {
    const ordersData = await db
        .select({ userId: orders.userId, stripeId: orders.stripeId })
        .from(orders)
        .where(eq(orders.stockReserved, true))
        .limit(100);

    return ordersData;
};

export const getOrders = async (
    userId: string,
    query: QueryInput<typeof ordersQuery.config>,
) => {
    const args = buildQuery(query, ordersQuery);

    const ordersData = await db.query.orders.findMany({
        ...args,
        where: and(eq(orders.userId, userId), args.where),
    });

    return ordersData;
};

export const getOrderHistory = async (
    userId: string,
    page: number,
    pageSize: number,
    status?: "Processing" | "Shipped" | "Delivered" | "Cancelled",
) => {
    const where = and(
        eq(orders.userId, userId),
        status ? eq(orders.deliveryStatus, status) : undefined,
    );

    const [rows, [total]] = await Promise.all([
        db.query.orders.findMany({
            where,
            orderBy: (table, { desc }) => [
                desc(table.createdAt),
                desc(table.id),
            ],
            limit: pageSize,
            offset: (page - 1) * pageSize,
        }),
        db.select({ total: count() }).from(orders).where(where),
    ]);

    if (!total) {
        throw new ApiError({
            statusCode: 500,
            message: "Failed to retrieve total orders count",
        });
    }

    const data = await Promise.all(
        rows.map(async (order) => ({
            ...order,
            cartItems: await Promise.all(
                order.cartItems.map(async (item) => ({
                    ...item,
                    product:
                        "name" in item.product
                            ? item.product
                            : await db.query.products.findFirst({
                                  where: eq(products.id, item.product.id),
                                  with: { image: true },
                              }),
                })),
            ),
        })),
    );

    return { data, totalPages: Math.ceil(total.total / pageSize) };
};

export const createOrder = async (
    userId: string,
    input: z.infer<typeof orderInsertSchema>,
    gateway: PaymentGateway = paymentGateway,
) => {
    let sessionId: string | undefined;

    try {
        return await db.transaction(async (tx) => {
            const [user] = await tx
                .select()
                .from(users)
                .where(eq(users.id, userId))
                .for("update");

            if (!user || user.blocked || !user.confirmed) {
                throw new ApiError({
                    statusCode: 403,
                    message: "Access denied",
                });
            }

            const cartHasPendingCheckout = await tx.query.orders.findFirst({
                columns: {
                    id: true,
                },
                where: and(
                    eq(orders.userId, userId),
                    eq(orders.stockReserved, true),
                    sql`exists (select 1 from jsonb_array_elements(${orders.cartItems}) item where ${inArray(
                        sql`item->>'id'`,
                        input.cartItems.map((item) => item.id),
                    )})`,
                ),
            });

            if (cartHasPendingCheckout) {
                throw new ApiError({
                    statusCode: 409,
                    message:
                        "This cart already has a pending checkout. Complete it or wait for it to expire",
                });
            }

            const productRows = await tx
                .select()
                .from(products)
                .where(
                    inArray(
                        products.id,
                        input.cartItems.map((item) => item.product.id),
                    ),
                )
                .orderBy(asc(products.id))
                .for("update");

            const cartRows = await tx
                .select()
                .from(carts)
                .where(
                    and(
                        eq(carts.userId, userId),
                        inArray(
                            carts.id,
                            input.cartItems.map((item) => item.id),
                        ),
                    ),
                )
                .orderBy(asc(carts.id))
                .for("update");

            const items = [];
            const lines = [];
            const needed = new Map<string, number>();

            for (const item of input.cartItems) {
                const cart = cartRows.find((row) => row.id === item.id);
                const product = productRows.find(
                    (row) => row.id === item.product.id,
                );

                if (
                    !cart ||
                    cart.productId !== item.product.id ||
                    item.user.id !== userId ||
                    !product ||
                    product.visibility !== "visible" ||
                    !product.inStock
                ) {
                    throw new ApiError({
                        statusCode: 409,
                        message:
                            "Cart changed or product is unavailable. Refresh your cart",
                    });
                }

                if (cart.quantity !== item.quantity) {
                    throw new ApiError({
                        statusCode: 409,
                        message: "Cart quantity changed. Refresh your cart",
                    });
                }

                const nextTotal = (needed.get(product.id) ?? 0) + cart.quantity;

                if (nextTotal > product.quantity) {
                    throw new ApiError({
                        statusCode: 409,
                        message: "Insufficient product stock",
                    });
                }

                needed.set(product.id, nextTotal);

                const effectivePrice =
                    product.isDiscount && product.discountedPrice !== null
                        ? product.discountedPrice
                        : product.price;

                if (!/^\d+(\.\d{1,4})?$/.test(effectivePrice)) {
                    throw new ApiError({
                        statusCode: 409,
                        message: "Invalid product price",
                    });
                }

                const [whole, fraction = ""] = effectivePrice.split(".");

                if (/[1-9]/.test(fraction.slice(2))) {
                    throw new ApiError({
                        statusCode: 409,
                        message: "Price must use whole cents",
                    });
                }

                const price =
                    Number(whole) * 100 +
                    Number(fraction.slice(0, 2).padEnd(2, "0"));

                if (
                    !Number.isSafeInteger(price) ||
                    price < 0 ||
                    price > 100000000
                ) {
                    throw new ApiError({
                        statusCode: 409,
                        message: "Invalid product price",
                    });
                }

                lines.push({
                    name: `${product.name} x ${cart.quantity}`,
                    amount: price * cart.quantity,
                });

                const snapshot = await tx.query.products.findFirst({
                    where: eq(products.id, product.id),
                    with: { image: true },
                });

                items.push({
                    id: cart.id,
                    quantity: cart.quantity,
                    user: { id: userId },
                    product: snapshot!,
                });
            }

            const subtotal = lines.reduce((sum, line) => sum + line.amount, 0);

            if (
                !Number.isSafeInteger(subtotal) ||
                subtotal > 100000000 ||
                subtotal < 50
            ) {
                throw new ApiError({
                    statusCode: 409,
                    message: "Order amount is outside the checkout limits",
                });
            }

            const coupon = input.couponCode
                ? (
                      await tx
                          .select()
                          .from(coupons)
                          .where(eq(coupons.code, input.couponCode))
                          .for("update")
                  )[0]
                : undefined;

            let discount = 0;

            if (input.couponCode) {
                if (
                    !coupon ||
                    !coupon.enabled ||
                    coupon.currency !== "usd" ||
                    (coupon.expiresAt &&
                        coupon.expiresAt.getTime() <= Date.now()) ||
                    subtotal < coupon.minimumMinor
                ) {
                    throw new ApiError({
                        statusCode: 409,
                        message:
                            "Coupon is invalid, expired or its minimum order value is not met",
                    });
                }

                const [couponUsage] = await tx
                    .select({ total: count() })
                    .from(couponRedemptions)
                    .where(eq(couponRedemptions.couponId, coupon.id));

                if (!couponUsage) {
                    throw new ApiError({
                        statusCode: 500,
                        message: "Failed to retrieve coupon usage statistics",
                    });
                }

                if (
                    coupon.usageLimit !== null &&
                    couponUsage.total >= coupon.usageLimit
                ) {
                    throw new ApiError({
                        statusCode: 409,
                        message: "Coupon usage limit reached",
                    });
                }

                discount = Math.min(
                    subtotal,
                    coupon.kind === "percentage"
                        ? Math.floor((subtotal * coupon.amount) / 100)
                        : coupon.amount,
                );

                let allocated = 0;
                let running = 0;

                for (const line of lines) {
                    running += line.amount;

                    const share =
                        Math.floor((discount * running) / subtotal) - allocated;
                    allocated += share;

                    line.amount -= share;
                }
            }

            const orderId = `ORD-${Date.now().toString(36)}-${randomBytes(3).toString("hex").toUpperCase()}`;
            const expiresAt = Math.floor(Date.now() / 1000) + 31 * 60;
            const session = await gateway.create({
                orderId,
                email: user.email,
                expiresAt,
                lines,
            });

            sessionId = session.id;

            for (const [id, quantity] of needed) {
                await tx
                    .update(products)
                    .set({
                        quantity: sql`${products.quantity} - ${quantity}`,
                        inStock: sql`${products.quantity} - ${quantity} > 0`,
                        updatedAt: new Date(),
                    })
                    .where(eq(products.id, id));
            }

            await tx.insert(orders).values({
                userId,
                orderId,
                stripeId: session.id,
                cartItems: items,
                totalMinor: subtotal - discount,
                currency: "usd",
                stockReserved: true,
                checkoutExpiresAt: new Date(session.expires_at * 1000),
            });

            if (coupon) {
                await tx.insert(couponRedemptions).values({
                    couponId: coupon.id,
                    userId,
                    stripeId: session.id,
                    discountMinor: discount,
                    expiresAt: new Date(session.expires_at * 1000),
                });
            }

            return { stripeSession: { id: session.id, url: session.url } };
        });
    } catch (error) {
        if (sessionId) {
            await gateway.expire(sessionId).catch(() => {
                console.error(
                    "Checkout compensation failed; payment session requires reconciliation",
                );
            });
        }

        if (error instanceof ApiError) {
            throw error;
        }

        throw new ApiError({
            statusCode: 503,
            message: "Checkout is temporarily unavailable. Please try again",
        });
    }
};

export const confirm = async (
    userId: string,
    stripeId: string,
    gateway: PaymentGateway = paymentGateway,
) => {
    const known = await db.query.orders.findFirst({
        where: and(eq(orders.userId, userId), eq(orders.stripeId, stripeId)),
    });

    if (!known) {
        throw new ApiError({ statusCode: 404, message: "Order not found" });
    }

    if (known.isSuccess) {
        return { isSuccess: true };
    }

    const session = await gateway.retrieve(stripeId);

    return await db.transaction(async (tx) => {
        const [order] = await tx
            .select()
            .from(orders)
            .where(
                and(eq(orders.userId, userId), eq(orders.stripeId, stripeId)),
            )
            .for("update");

        if (!order) {
            throw new ApiError({ statusCode: 404, message: "Order not found" });
        }

        if (order.isSuccess) {
            return { isSuccess: true };
        }

        const paid =
            session.payment_status === "paid" ||
            (session.payment_status === "no_payment_required" &&
                session.status === "complete");

        if (paid) {
            if (
                order.deliveryStatus === "Cancelled" ||
                session.currency !== order.currency ||
                session.amount_total === null ||
                session.amount_total < (order.totalMinor ?? 0)
            ) {
                throw new ApiError({
                    statusCode: 409,
                    message: "Payment requires manual reconciliation",
                });
            }

            if (!order.stockReserved) {
                throw new ApiError({
                    statusCode: 409,
                    message: "Legacy checkout requires manual reconciliation",
                });
            }

            await tx
                .update(orders)
                .set({
                    isSuccess: true,
                    totalMinor: session.amount_total ?? order.totalMinor,
                    stockReserved: false,
                    updatedAt: new Date(),
                })
                .where(eq(orders.id, order.id));

            await tx
                .update(couponRedemptions)
                .set({ usedAt: new Date() })
                .where(eq(couponRedemptions.stripeId, order.stripeId));

            for (const item of order.cartItems) {
                const [cart] = await tx
                    .select()
                    .from(carts)
                    .where(
                        and(
                            eq(carts.id, item.id),
                            eq(carts.userId, order.userId),
                        ),
                    )
                    .for("update");

                if (!cart || cart.productId !== item.product.id) {
                    continue;
                }

                if (cart.quantity <= item.quantity) {
                    await tx.delete(carts).where(eq(carts.id, cart.id));
                }

                if (cart.quantity > item.quantity) {
                    await tx
                        .update(carts)
                        .set({ quantity: cart.quantity - item.quantity })
                        .where(eq(carts.id, cart.id));
                }
            }
        }

        if (session.status === "expired" && order.stockReserved && !paid) {
            if (order.stockReserved) {
                for (const item of [...order.cartItems].sort((a, b) =>
                    a.product.id.localeCompare(b.product.id),
                )) {
                    await tx
                        .update(products)
                        .set({
                            quantity: sql`${products.quantity} + ${item.quantity}`,
                            inStock: true,
                            updatedAt: new Date(),
                        })
                        .where(eq(products.id, item.product.id));
                }
            }

            await tx
                .delete(couponRedemptions)
                .where(
                    and(
                        eq(couponRedemptions.stripeId, order.stripeId),
                        isNull(couponRedemptions.usedAt),
                    ),
                );

            await tx
                .update(orders)
                .set({
                    isSuccess: false,
                    stockReserved: false,
                    deliveryStatus: "Cancelled",
                    updatedAt: new Date(),
                })
                .where(eq(orders.id, order.id));
        }

        return { isSuccess: paid };
    });
};
