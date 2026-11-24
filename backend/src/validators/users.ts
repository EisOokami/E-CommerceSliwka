import { createInsertSchema } from "drizzle-zod";
import { users } from "../db/schema.js";
import z from "zod";

export const userUpdateSchema = createInsertSchema(users, {
    username: z
        .string()
        .trim()
        .min(1, "Username must be at least 1 characters")
        .max(255, "Username must be less than 255 characters"),
    email: z
        .email("Invalid email format")
        .trim()
        .toLowerCase()
        .min(1, "Email is required")
        .max(255, "Email must be less than 255 characters long"),
})
    .pick({
        username: true,
        email: true,
    })
    .partial()
    .extend({
        currentPassword: z
            .string()
            .min(1, "Current password is required")
            .max(255, "Password must be less than 255 characters long")
            .optional(),
    });

export const changePasswordSchema = z
    .object({
        currentPassword: z
            .string()
            .min(8, "Password must be at least 8 characters long")
            .max(255, "Password must be less than 255 characters long")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/,
                "Password must contain at least one uppercase letter, one lowercase letter, one special character and one number",
            ),
        newPassword: z
            .string()
            .min(8, "Password must be at least 8 characters long")
            .max(255, "Password must be less than 255 characters long")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/,
                "Password must contain at least one uppercase letter, one lowercase letter, one special character and one number",
            ),
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
        message: "Passwords are the same",
        path: ["confirmPassword"],
    });

export const deleteAccountSchema = z
    .object({
        password: z
            .string()
            .min(1, "Password is required")
            .max(255, "Password must be less than 255 characters long")
            .optional(),
        code: z
            .string()
            .trim()
            .regex(/^\d{6}$/, "Enter the six-digit code")
            .optional(),
    })
    .strict();

export const setPasswordSchema = z.object({
    newPassword: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(255, "Password must be less than 255 characters long")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/,
            "Password must contain at least one uppercase letter, one lowercase letter, one special character and one number",
        ),
});

export const acceptTermsSchema = z.object({
    acceptTerms: z.literal(true, {
        error: "You must accept the Terms of Service and the Privacy Policy",
    }),
});
