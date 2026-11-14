import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .email("Invalid email format")
        .trim()
        .toLowerCase()
        .min(1, "Email is required")
        .max(255, "Email must be less than 255 characters long"),
    password: z
        .string()
        .min(12, "Password must be at least 12 characters long")
        .max(255, "Password must be less than 255 characters long")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/,
            "Password must contain at least one uppercase letter, one lowercase letter, one special character and one number",
        ),
});

export const verifyMfaSchema = z.object({
    code: z.string().regex(/^\d{6}$/, "Code must be 6 digits"),
});

export const reauthSchema = z.object({
    password: z
        .string()
        .min(12, "Password must be at least 12 characters long")
        .max(255, "Password must be less than 255 characters long")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/,
            "Password must contain at least one uppercase letter, one lowercase letter, one special character and one number",
        ),
    code: z
        .string()
        .regex(/^\d{6}$/)
        .optional(),
});

export const passwordSchema = z.object({
    password: z
        .string()
        .min(12, "Password must be at least 12 characters long")
        .max(255, "Password must be less than 255 characters long")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/,
            "Password must contain at least one uppercase letter, one lowercase letter, one special character and one number",
        ),
});
