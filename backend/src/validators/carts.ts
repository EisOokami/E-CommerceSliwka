import { createInsertSchema } from "drizzle-zod";
import { carts } from "../db/schema.js";
import { uuidSchema } from "./validators.js";
import z from "zod";

export const cartInsertSchema = createInsertSchema(carts, {
    quantity: z
        .number()
        .int()
        .min(1, "Quantity must be at least 1")
        .max(999, "Quantity cannot exceed 999"),
    productId: uuidSchema,
}).pick({
    quantity: true,
    productId: true,
});

export const cartUpdateSchema = z
    .object({
        quantity: z
            .number()
            .int()
            .min(1, "Quantity must be at least 1")
            .max(999, "Quantity cannot exceed 999"),
    })
    .strict();
