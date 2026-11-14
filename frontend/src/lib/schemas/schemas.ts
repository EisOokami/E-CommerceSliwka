import z from "zod";

export const uuidSchema = z.uuid();

export const payloadSchema = z.record(z.string(), z.unknown());

export const paginationSchema = z.object({
    page: z
        .number()
        .int()
        .min(1, "Page must be at least 1")
        .max(100000, "Page must not exceed 100000"),
    pageSize: z
        .number()
        .int()
        .min(1, "Page size must be at least 1")
        .max(100, "Page size must not exceed 100"),
});
