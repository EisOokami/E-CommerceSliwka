import { z } from "zod";

export const cartItemsSchema = z.object({
    id: z.uuid(),
    quantity: z
        .number()
        .int()
        .min(1, "Quantity must be at least 1")
        .max(999, "Quantity cannot exceed 999"),
    product: z.object({ id: z.uuid() }),
    user: z.object({ id: z.uuid() }),
});

const cartItemsArraySchema = z
    .array(cartItemsSchema, { error: "Cart items must be an array" })
    .min(1, "Cart must contain at least one item")
    .max(100, "Cart must not contain more than 100 items")
    .refine((rows) => new Set(rows.map((row) => row.id)).size === rows.length, {
        error: "Cart must not contain duplicate items",
    });

export const orderInsertSchema = z.union(
    [
        cartItemsArraySchema.transform((cartItems) => ({
            cartItems,
            couponCode: undefined,
        })),

        z.strictObject(
            {
                cartItems: cartItemsArraySchema,
                couponCode: z
                    .string()
                    .trim()
                    .toUpperCase()
                    .regex(
                        /^[A-Z0-9_-]{2,50}$/,
                        "Coupon code must be 2-50 characters long",
                    )
                    .optional(),
            },
            {
                error: (issue) =>
                    issue.code === "unrecognized_keys"
                        ? `Unrecognized field(s): ${issue.keys.join(", ")}`
                        : "Order must be an array of cart items or an object with cartItems",
            },
        ),
    ],
    {
        error: "Invalid order",
    },
);

export const orderConfirmSchema = z.strictObject(
    {
        checkoutSession: z
            .string()
            .regex(
                /^cs_[a-zA-Z0-9_]{1,250}$/,
                "Checkout session has an invalid format",
            ),
    },
    {
        error: (issue) =>
            issue.code === "unrecognized_keys"
                ? `Unrecognized field(s): ${issue.keys.join(", ")}`
                : "Request body must be an object",
    },
);

export const orderHistorySchema = z.object({
    page: z.coerce
        .number()
        .int()
        .min(1, "Page must be at least 1")
        .max(100000, "Page must not exceed 100000")
        .default(1),
    pageSize: z.coerce
        .number()
        .int()
        .min(1, "Page size must be at least 1")
        .max(100, "Page size must not exceed 100")
        .default(8),
    status: z
        .enum(["Processing", "Shipped", "Delivered", "Cancelled"], {
            error: "Status must be one of: Processing, Shipped, Delivered, Cancelled",
        })
        .optional(),
});
