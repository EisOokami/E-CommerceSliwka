import type { Core } from "@strapi/strapi";
import { Context, Next } from "koa";
import { RateLimit } from "koa2-ratelimit";

export default (_config: any, {}: { strapi: Core.Strapi }) => {
    return async (ctx: Context, next: Next) => {
        return RateLimit.middleware({
            interval: { min: 1 }, // 5 minute
            max: 1000, // limit each IP to 100 requests per minute
            message: "Too many requests, please try again later.",
            headers: true,
        })(ctx, next);
    };
};