import z from "zod";

export const quantitySchema = z
    .number()
    .int()
    .min(1, "Quantity must be at least 1")
    .max(999, "Quantity cannot exceed 999");

export const redirectToCheckoutSchema = z.object({
    cartItems: z
        .array(
            z.object({
                id: z.uuid(),
                quantity: z.number().int().min(1).max(999),
                product: z.object({ id: z.uuid() }),
                user: z.object({ id: z.uuid() }),
            }),
        )
        .min(1, "Cart must contain at least one item.")
        .max(100)
        .refine((items) => {
            return (
                new Set(
                    items.map((item) => {
                        return item.id;
                    }),
                ).size === items.length
            );
        }, "Cart must not contain duplicate items."),
    couponCode: z
        .string()
        .trim()
        .toUpperCase()
        .regex(
            /^[A-Z0-9_-]{2,50}$/,
            "Coupon code must be 2-50 characters long.",
        )
        .optional(),
});

export const sessionSchema = z.string().regex(/^cs_[a-zA-Z0-9_]{1,250}$/);
