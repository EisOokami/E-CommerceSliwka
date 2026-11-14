import { z } from "zod";

const money = z
    .string()
    .regex(
        /^\d{1,7}(\.\d{1,2}0{0,2})?$/,
        "Enter a non-negative amount in whole cents.",
    )
    .refine((value) => {
        return Number(value) <= 1000000;
    }, "Price exceeds the checkout limit.");

export const productInputSchema = z.object({
    name: z.string().trim().min(1).max(255),
    description: z.string().max(6000),
    slug: z
        .string()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .max(255),
    imageId: z.uuid("Enter an existing image UUID."),
    category: z.string().trim().min(1).max(255),
    quantity: z.number().int().min(0).max(2147483647),
    color: z.string().regex(/^#[a-fA-F0-9]{6}$/),
    visibility: z.enum(["visible", "draft", "hidden"]),
    price: money,
    discountedPrice: money,
    isDiscount: z.boolean(),
});
