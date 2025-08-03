import { Core } from "@strapi/strapi";

const getService = (name) => {
    return strapi.plugin("users-permissions").service(name);
};

export default (config, { strapi }: { strapi: Core.Strapi }) =>
    async (ctx, next) => {
        if (
            ctx.path.includes("/api/auth/local") ||
            ctx.path.includes("/admin") ||
            ctx.path.includes("/content-manager") ||
            ctx.path.includes("/content-type-builder") ||
            ctx.path.includes("/users-permissions")
        ) {
            return next();
        }

        const safeMethods = ["GET", "HEAD", "OPTIONS"];

        if (safeMethods.includes(ctx.method)) {
            return next();
        }

        const csrfHeader = ctx.get("X-CSRF-Token");
        const data =
            await strapi.plugins["users-permissions"].services.jwt.getToken(
                ctx,
            );
        const user = await strapi.db
            .query("plugin::users-permissions.user")
            .findOne({
                where: {
                    id: data.id,
                },
            });
        const validCsrfToken = await getService("user").validatePassword(
            csrfHeader,
            user.csrfToken,
        );

        if (!csrfHeader || !user.csrfToken || !validCsrfToken) {
            return ctx.unauthorized("Invalid CSRF token");
        }

        await next();
    };
