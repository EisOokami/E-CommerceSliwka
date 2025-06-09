import type { Core } from "@strapi/strapi";
import { Context, Next } from "koa";
import { RateLimit } from "koa2-ratelimit";

export default (_config: any, {}: { strapi: Core.Strapi }) => {
    return async (ctx: Context, next: Next) => {
        return RateLimit.middleware({
            interval: { min: 3 },
            max: 50,
            message: "Too many requests, please slow down.",
            headers: true,
        })(ctx, next);
    };
};