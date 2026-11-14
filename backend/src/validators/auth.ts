import z from "zod";

export const forgotPasswordSchema = z.object({
    email: z
        .email("Invalid email format")
        .trim()
        .toLowerCase()
        .min(1, "Email is required")
        .max(255, "Email must be less than 255 characters long"),
});

export const loginSchema = z.object({
    email: z
        .email("Invalid email format")
        .trim()
        .toLowerCase()
        .min(1, "Email is required")
        .max(255, "Email must be less than 255 characters long"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(255, "Password must be less than 255 characters long")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/,
            "Password must contain at least one uppercase letter, one lowercase letter, one special character and one number",
        ),
});

export const registerSchema = z.object({
    username: z
        .string()
        .trim()
        .min(1, "Username must be at least 1 characters")
        .max(255, "Username must be less than 255 characters"),
    email: z
        .email("Please enter a valid email address")
        .trim()
        .toLowerCase()
        .min(1, "Email is required")
        .max(255, "Email must be less than 255 characters long"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(255, "Password must be less than 255 characters long")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/,
            "Password must contain at least one uppercase letter, one lowercase letter, one special character and one number",
        ),
});

export const resendVerificationSchema = z.object({
    email: z
        .email("Invalid email format")
        .trim()
        .toLowerCase()
        .min(1, "Email is required")
        .max(255, "Email must be less than 255 characters long"),
});

export const resetPasswordSchema = z.object({
    token: z.string("Invalid token"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(255, "Password must be less than 255 characters long")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/,
            "Password must contain at least one uppercase letter, one lowercase letter, one special character and one number",
        ),
    id: z.uuid("Invalid data"),
});

export const verifyMfaSchema = z.object({
    tempToken: z.string().regex(/^[a-f0-9]{64}$/),
    code: z.string().regex(/^\d{6}$/),
});
