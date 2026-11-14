import { z } from "zod";

const optionFiltersSchema = z.record(
    z.string().max(255, "Option name must not exceed 255 characters"),
    z
        .array(
            z.string().max(255, "Option value must not exceed 255 characters"),
            { error: "Option values must be an array of strings" },
        )
        .max(30, "Option must not have more than 30 values"),
    { error: "Option filters must be a JSON object" },
);

export const productSearchSchema = z.object({
    page: z.coerce
        .number()
        .int()
        .min(1, "Page must be at least 1")
        .max(100000, "Page must not exceed 100000")
        .default(1),
    pageSize: z.coerce
        .number()
        .int()
        .min(1, "Page size must be at least 1")
        .max(100, "Page size must not exceed 100")
        .default(20),
    search: z
        .string()
        .max(200, "Search query must not exceed 200 characters")
        .default(""),
    category: z
        .string()
        .trim()
        .min(1, "Category is required")
        .max(255, "Category must not exceed 255 characters")
        .optional(),
    color: z
        .string()
        .max(255, "Color must not exceed 255 characters")
        .optional(),
    rating: z.coerce
        .number()
        .int()
        .min(0, "Rating must be at least 0")
        .max(5, "Rating must not exceed 5")
        .optional(),
    minPrice: z.coerce
        .number()
        .min(0, "Minimum price must not be negative")
        .optional(),
    maxPrice: z.coerce
        .number()
        .min(0, "Minimum price must not be negative")
        .optional(),
    sort: z
        .enum(
            [
                "createdAt",
                "name",
                "price",
                "finalPrice",
                "quantity",
                "averageRating",
            ],
            {
                error: "Sort field must be one of: createdAt, name, price, finalPrice, quantity, averageRating",
            },
        )
        .default("createdAt"),
    direction: z
        .enum(["asc", "desc"], {
            error: "Sort direction must be either 'asc' or 'desc'",
        })
        .default("desc"),
    options: z
        .string()
        .max(4000, "Option filters must not exceed 4000 characters")
        .optional()
        .transform((value, ctx) => {
            if (!value) return {};

            let parsed: unknown;

            try {
                parsed = JSON.parse(value);
            } catch {
                ctx.issues.push({
                    code: "custom",
                    message: "Option filters must be valid JSON",
                    input: value,
                });

                return z.NEVER;
            }

            const result = optionFiltersSchema.safeParse(parsed);

            if (!result.success) {
                for (const issue of result.error.issues) {
                    const where = issue.path.length
                        ? ` (at "${issue.path.join(".")}")`
                        : "";

                    ctx.issues.push({
                        code: "custom",
                        message: `${issue.message}${where}`,
                        input: value,
                    });
                }
                return z.NEVER;
            }

            return result.data;
        }),
});

export const productDetailSchema = z.object({
    key: z
        .string()
        .min(1, "Product key is required")
        .max(255, "Product key must not exceed 255 characters"),
});

export const productFiltersSchema = z.object({
    category: z
        .string()
        .trim()
        .max(255, "Category must not exceed 255 characters")
        .optional(),
});

export type ProductSearch = z.infer<typeof productSearchSchema>;
