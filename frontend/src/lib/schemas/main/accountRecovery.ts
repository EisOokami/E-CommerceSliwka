import z from "zod";

export const recoveryModeSchema = z.enum([
    "verify",
    "resend",
    "forgot",
    "reset",
]);

export const tokenSchema = z
    .string()
    .regex(/^[a-f0-9]{64}$/, "Invalid or expired link.");

export const recoverAccountSchema = z
    .object({
        token: tokenSchema,
        id: z.uuid(),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters long")
            .max(255, "Password must be less than 255 characters long")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/,
                "Password must contain at least one uppercase letter, one lowercase letter, one special character and one number",
            ),
        confirmation: z
            .string()
            .min(8, "Password must be at least 8 characters long")
            .max(255, "Password must be less than 255 characters long")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/,
                "Password must contain at least one uppercase letter, one lowercase letter, one special character and one number",
            ),
    })
    .refine(
        (value) => {
            return value.password === value.confirmation;
        },
        {
            message: "Passwords do not match.",
        },
    );

export const emailSchema = z
    .email("Invalid email format")
    .trim()
    .toLowerCase()
    .min(1, "Email is required")
    .max(255, "Email must be less than 255 characters long");
