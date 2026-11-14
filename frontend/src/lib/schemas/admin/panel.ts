import { z } from "zod";
import { permissions as allPermissions } from "@/interfaces/admin/api";
import { productRelationsSchema } from "./catalog";

const deliveryStatusEnum = {
    enumValues: ["Processing", "Shipped", "Delivered", "Cancelled"] as const,
};
const visibilityEnum = { enumValues: ["visible", "draft", "hidden"] as const };

export const listSchema = z.object({
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
        .string()
        .max(40, "Status must not exceed 200 characters")
        .optional(),
    sort: z
        .enum(["createdAt", "name", "price"], {
            error: "Sort field must be one of: createdAt, name, price",
        })
        .default("createdAt"),
    direction: z
        .enum(["asc", "desc"], {
            error: "Sort direction must be either 'asc' or 'desc'",
        })
        .default("desc"),
});

export const productSchema = productRelationsSchema.extend({
    name: z
        .string()
        .trim()
        .min(1, "Name must be at least 1 characters")
        .max(255, "Name must be less than 255 characters"),
    description: z
        .string()
        .max(6000, "Description must be less than 6000 characters long"),
    price: z
        .string()
        .regex(/^\d{1,7}(\.\d{1,2}0{0,2})?$/, "Price must use whole cents")
        .refine((value) => {
            return Number(value) <= 1000000;
        }, "Price exceeds the checkout limit"),
    imageId: z.uuid(),
    slug: z
        .string()
        .min(1, "Slug must be at least 1 characters")
        .max(255, "Slug must be 255 characters or less")
        .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Slug can only contain lowercase letters, numbers, and single hyphens",
        ),
    category: z
        .string()
        .trim()
        .min(1, "Category is required")
        .max(255, "Category must not exceed 255 characters"),
    quantity: z
        .number()
        .int()
        .min(0, "Quantity must not be negative")
        .max(2147483647, "Quantity must not exceed 2147483647"),
    color: z
        .string()
        .length(7, "Color must be a valid HEX value")
        .regex(/^#[A-Fa-f0-9]{6}$/, "Color must be a valid HEX value")
        .nullable(),
    visibility: z.enum(visibilityEnum.enumValues),
    isDiscount: z.boolean().default(false),
    discountedPrice: z
        .string()
        .regex(/^\d{1,7}(\.\d{1,2}0{0,2})?$/, "Price must use whole cents")
        .refine((value) => {
            return Number(value) <= 1000000;
        }, "Price exceeds the checkout limit")
        .default("0"),
});

export const orderSchema = z.object({
    deliveryStatus: z.enum(deliveryStatusEnum.enumValues),
});

export const userSchema = z.object({ blocked: z.boolean() });

export const adminCreateSchema = z.object({
    email: z
        .email("Invalid email format")
        .trim()
        .toLowerCase()
        .min(1, "Email is required")
        .max(255, "Email must be less than 255 characters long"),
    fullName: z
        .string()
        .trim()
        .min(1, "Full name must be at least 1 characters")
        .max(255, "Full name must be less than 255 characters"),
    password: z
        .string()
        .min(12, "Password must be at least 12 characters long")
        .max(255, "Password must be less than 255 characters long")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/,
            "Password must contain at least one uppercase letter, one lowercase letter, one special character and one number",
        ),
    role: z.enum(["admin", "manager", "support"], {
        error: (issue) => {
            return issue.input === undefined
                ? "Role is required"
                : `Invalid role: "${String(issue.input)}"`;
        },
    }),
    permissions: z
        .array(
            z.enum(allPermissions, {
                error: (iss) => {
                    return `Invalid permission: "${String(iss.input)}"`;
                },
            }),
            { error: "Permissions must be an array" },
        )
        .max(
            allPermissions.length,
            `Permissions must not contain more than ${allPermissions.length} items`,
        )
        .refine(
            (array) => {
                return new Set(array).size === array.length;
            },
            {
                error: "Permissions must not contain duplicates",
            },
        ),
});

export const adminUpdateSchema = adminCreateSchema
    .omit({ email: true, password: true })
    .extend({ isActive: z.boolean() });

export const settingsSchema = z.object({
    storeName: z
        .string()
        .trim()
        .min(1, "Store name is required")
        .max(100, "Store name must not exceed 100 characters"),
    lowStockThreshold: z
        .number()
        .int()
        .min(0, "Low stock threshold must not be negative")
        .max(10000, "Low stock threshold must not exceed 10000"),
});

export type ListInput = z.infer<typeof listSchema>;
export type Resource = "products" | "orders" | "users" | "admins";
