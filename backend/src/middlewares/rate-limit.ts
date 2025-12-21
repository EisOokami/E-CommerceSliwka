import type { Core } from "@strapi/strapi";
import { Context, Next } from "koa";
import { RateLimit } from "koa2-ratelimit";

export default (_config: any, {}: { strapi: Core.Strapi }) => {
    return async (ctx: Context, next: Next) => {
        return RateLimit.middleware({
            interval: { min: 1 },
            max: 500,
            message: {
                error: {
                    name: "RateLimitError",
                    message: "Too many requests, please try again later.",
                    status: 429,
                },
            },
            headers: true,
        })(ctx, next);
    };
};
