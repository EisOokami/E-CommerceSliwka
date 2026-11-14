import z from "zod";

export const uuidSchema = z.uuid();

export const validateIdSchema = z.object({
    id: uuidSchema,
});
