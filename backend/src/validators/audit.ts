import z from "zod";

export const limitSchema = z.coerce.number().int().min(1).max(100).default(100);
