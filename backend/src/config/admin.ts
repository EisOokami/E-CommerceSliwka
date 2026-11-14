import { adminConfigSchema } from "../validators/adminConfig.js";

export function validateAdminConfig(env: NodeJS.ProcessEnv = process.env) {
    const result = adminConfigSchema.safeParse(env);

    if (!result.success) {
        throw new Error(
            "Invalid admin configuration: " +
                result.error.issues
                    .map((issue) => issue.path.join("."))
                    .join(", "),
        );
    }

    for (const origin of result.data.ADMIN_ORIGINS.split(",").map((value) =>
        value.trim(),
    )) {
        const url = new URL(origin);

        if (
            url.origin !== origin ||
            !["https:", "http:"].includes(url.protocol) ||
            (env.NODE_ENV === "production" && url.protocol !== "https:")
        ) {
            throw new Error(
                "ADMIN_ORIGINS must contain exact origins, using HTTPS in production",
            );
        }
    }

    return result.data;
}
