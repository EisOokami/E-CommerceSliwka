import type { Core } from "@strapi/strapi";
import { Context, Next } from "koa";
import { RateLimit } from "koa2-ratelimit";

const IP_BASED_LIMITS = {
    "auth/local/register": {
        interval: 60 * 60 * 1000,
        max: 1,
        message: "Too many registration attempts from this IP, try again later."
    },
    "auth/local": {
        interval: 60 * 1000,
        max: 10,
        message: "Too many login attempts, try again later."
    }
};

export default (_config: any, { strapi }: { strapi: Core.Strapi }) => {
    return async (ctx: Context, next: Next) => {
        const path = ctx.request.url.replace(/^\/api\//, "");

        const matchedLimit = Object.entries(IP_BASED_LIMITS).find(([key]) =>
            path.startsWith(key)
        );

        if (!matchedLimit) {
            return next();
        }

        const [_, { interval, max, message }] = matchedLimit;

        return RateLimit.middleware({
            interval,
            max,
            prefixKey: path,
            message,
            headers: true,
            keyGenerator: (ctx) => ctx.ip,
        })(ctx, next);
    };
};
