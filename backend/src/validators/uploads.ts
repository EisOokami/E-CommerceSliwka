import { z } from "zod";

export const fileInsertSchema = z.discriminatedUnion("field", [
    z.object({ field: z.literal("review"), reviewId: z.uuid() }).strict(),
    z
        .object({
            field: z.enum(["avatar", "file"]),
            reviewId: z.undefined().optional(),
        })
        .strict(),
]);

export const fileDeleteSchema = z
    .object({ field: z.enum(["avatar", "review", "file"]) })
    .strict();
