import z from "zod";

export const bootstrapAdminSchema = z.object({
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
        .min(8, "Password must be at least 8 characters long")
        .max(255, "Password must be less than 255 characters long")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/,
            "Password must contain at least one uppercase letter, one lowercase letter, one special character and one number",
        ),
});
