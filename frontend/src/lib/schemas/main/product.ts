import z from "zod";
import { imagesSchema } from "./image";

export const addReviewToProductSchema = z.object({
    productId: z.uuid(),
    description: z
        .string()
        .max(10000, "Description must be less than 10000 characters long"),
    rating: z
        .number()
        .int()
        .min(0, "Rating must be at least 0")
        .max(5, "Rating must not exceed 5"),
    images: imagesSchema,
});

export const editReviewSchema = z.object({
    productId: z.uuid(),
    description: z
        .string()
        .max(10000, "Description must be less than 10000 characters long"),
    rating: z
        .number()
        .int()
        .min(0, "Rating must be at least 0")
        .max(5, "Rating must not exceed 5"),
    images: imagesSchema,
});

export const retainedItemsSchema = z.array(
    z.object({
        id: z.uuid(),
    }),
);
