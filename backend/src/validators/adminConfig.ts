import z from "zod";

export const adminConfigSchema = z.object({
    COOKIE_SECRET: z.string().min(32),
    MFA_ENCRYPTION_KEY: z
        .string()
        .refine(
            (value) =>
                /^[A-Za-z0-9+/]{43}=$/.test(value) &&
                Buffer.from(value, "base64").length === 32,
            "Expected a base64 encoded 32-byte key",
        ),
    ADMIN_ORIGINS: z.string().min(1),
    TRUST_PROXY_HOPS: z.coerce.number().int().min(0).max(10).default(0),
});
