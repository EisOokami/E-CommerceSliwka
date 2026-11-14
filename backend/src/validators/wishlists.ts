import { createInsertSchema } from "drizzle-zod";
import { wishlists } from "../db/schema.js";
import { uuidSchema } from "./validators.js";

export const wishlistInsertSchema = createInsertSchema(wishlists, {
    productId: uuidSchema,
}).pick({
    productId: true,
});
