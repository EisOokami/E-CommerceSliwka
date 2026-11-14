import { z } from "zod";

const iconsEnum = {
    enumValues: [
        "phone",
        "cpu",
        "mainCamera",
        "frontCamera",
        "battery",
        "displayVr",
        "refresh",
        "weight",
        "laptop",
        "storage",
        "headphone",
        "noise",
        "sensor",
        "iso",
        "autofocus",
        "resolution",
        "screen",
    ] as const,
};

export const categorySchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Name must be at least 1 characters")
        .max(255, "Name must be less than 255 characters"),
    slug: z
        .string()
        .min(1, "Slug must be at least 1 characters")
        .max(255, "Slug must be 255 characters or less")
        .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Slug can only contain lowercase letters, numbers, and single hyphens",
        ),
    description: z
        .string()
        .trim()
        .max(6000, "Description must be less than 6000 characters long")
        .default(""),
});

export const reviewModerationSchema = z.object({ visible: z.boolean() });

export const couponSchema = z
    .object({
        code: z
            .string()
            .trim()
            .toUpperCase()
            .regex(/^[A-Z0-9_-]{3,50}$/, "Coupon code must be 3-50 characters"),
        kind: z.enum(["percentage", "fixed"]),
        amount: z.number().int().positive().max(2147483647),
        currency: z.literal("usd").default("usd"),
        enabled: z.boolean(),
        expiresAt: z.iso.datetime().nullable(),
        usageLimit: z.number().int().positive().max(2147483647).nullable(),
        minimumMinor: z.number().int().min(0).max(2147483647),
    })
    .refine(
        (value) => {
            return value.kind !== "percentage" || value.amount <= 100;
        },
        {
            path: ["amount"],
            message: "Percentage must not exceed 100",
        },
    );

export const productRelationsSchema = z.object({
    galleryIds: z
        .array(z.uuid())
        .max(20)
        .refine((value) => {
            return new Set(value).size === value.length;
        })
        .optional(),
    productVariants: z
        .array(
            z.object({
                name: z
                    .string()
                    .trim()
                    .min(1, "Name must be at least 1 characters")
                    .max(255, "Name must be less than 255 characters"),
                hex: z
                    .string()
                    .length(7, "Color must be a valid HEX value")
                    .regex(
                        /^#[a-fA-F0-9]{6}$/,
                        "Color must be a valid HEX value",
                    ),
                productSlug: z
                    .string()
                    .max(255, "Slug must be 255 characters or less")
                    .regex(
                        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                        "Slug can only contain lowercase letters, numbers, and single hyphens",
                    )
                    .nullable(),
                inStock: z.boolean(),
            }),
        )
        .max(30)
        .optional(),
    options: z
        .array(
            z.object({
                title: z
                    .string()
                    .trim()
                    .min(1, "Title must be at least 1 characters")
                    .max(255, "Title must be less than 255 characters"),
                optionDetails: z
                    .array(
                        z.object({
                            name: z
                                .string()
                                .trim()
                                .min(1, "Name must be at least 1 characters")
                                .max(
                                    255,
                                    "Name must be less than 255 characters",
                                ),
                            productSlug: z
                                .string()
                                .max(255, "Slug must be 255 characters or less")
                                .regex(
                                    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                                    "Slug can only contain lowercase letters, numbers, and single hyphens",
                                )
                                .nullable(),
                            inStock: z.boolean(),
                        }),
                    )
                    .max(30),
            }),
        )
        .max(20)
        .optional(),
    productSpecifications: z
        .array(
            z.object({
                name: z
                    .string()
                    .trim()
                    .min(1, "Name must be at least 1 characters")
                    .max(255, "Name must be less than 255 characters"),
                specification: z
                    .string()
                    .trim()
                    .min(1, "Specification must be at least 1 characters")
                    .max(255, "Specification must be less than 255 characters"),
                icon: z.enum(iconsEnum.enumValues),
            }),
        )
        .max(50)
        .optional(),
    productInfos: z
        .array(
            z.object({
                delivery: z
                    .string()
                    .trim()
                    .min(1, "Delivery must be at least 1 characters")
                    .max(255, "Delivery must be less than 255 characters"),
                inStore: z
                    .string()
                    .trim()
                    .min(1, "In store must be at least 1 characters")
                    .max(255, "In store must be less than 255 characters"),
                guaranteed: z
                    .string()
                    .trim()
                    .min(1, "Guaranteed must be at least 1 characters")
                    .max(255, "Guaranteed must be less than 255 characters"),
            }),
        )
        .max(1)
        .optional(),
    productSpecificationGroups: z
        .array(
            z.object({
                name: z
                    .string()
                    .trim()
                    .min(1, "Name must be at least 1 characters")
                    .max(255, "Name must be less than 255 characters"),
                specifications: z
                    .array(
                        z.object({
                            name: z
                                .string()
                                .trim()
                                .min(1, "Name must be at least 1 characters")
                                .max(
                                    255,
                                    "Name must be less than 255 characters",
                                ),
                            description: z
                                .string()
                                .trim()
                                .max(
                                    255,
                                    "Description must be less than 255 characters long",
                                ),
                        }),
                    )
                    .max(50),
            }),
        )
        .max(20)
        .optional(),
});

export const catalogListSchema = z.object({
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
    status: z
        .enum(["visible", "hidden", "enabled", "disabled", ""], {
            error: (issue) => {
                return issue.input === undefined
                    ? "Status is required"
                    : `Invalid status: "${String(issue.input)}"`;
            },
        })
        .optional(),
    sort: z
        .enum(["createdAt", "name"], {
            error: "Sort field must be one of: createdAt, name",
        })
        .default("createdAt"),
    direction: z
        .enum(["asc", "desc"], {
            error: "Sort direction must be either 'asc' or 'desc'",
        })
        .default("desc"),
});

export type ProductRelationsInput = z.infer<typeof productRelationsSchema>;
export type CatalogResource = "categories" | "reviews" | "coupons";
