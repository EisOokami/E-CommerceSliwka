import { createInsertSchema } from "drizzle-zod";
import z from "zod";
import { reviews } from "../db/schema.js";
import { uuidSchema } from "./validators.js";

export const reviewInsertSchema = createInsertSchema(reviews, {
    description: z
        .string()
        .min(0)
        .max(10000, "Description cannot exceed 10000 characters"),
    rating: z
        .number()
        .int()
        .min(1, "Rating must be at least 1")
        .max(5, "Rating cannot exceed 5"),
    productId: uuidSchema,
}).pick({
    description: true,
    rating: true,
    productId: true,
});

export const reviewUpdateSchema = createInsertSchema(reviews, {
    description: z
        .string()
        .min(0)
        .max(10000, "Description cannot exceed 10000 characters"),
    rating: z
        .number()
        .int()
        .min(1, "Rating must be at least 1")
        .max(5, "Rating cannot exceed 5"),
})
    .pick({
        description: true,
        rating: true,
    })
    .partial();
