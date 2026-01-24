/**
 * order controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
    "api::order.order",
    ({ strapi }) => ({
        async find(ctx) {
            const user = ctx.state.user;

            if (!user) {
                return ctx.unauthorized("You are not authorized!");
            }

            const params = (await this.sanitizeQuery(ctx)) as Record<
                string,
                any
            >;

            const result = await strapi
                .service("api::order.order")
                .findOrder(params, user);

            ctx.send(result);
        },

        async create(ctx) {
            const user = ctx.state.user;

            if (!user) {
                return ctx.unauthorized("You are not authorized!");
            }

            const { cartItems } = ctx.request.body.data;

            const result = await strapi
                .service("api::order.order")
                .createOrder(cartItems, user, ctx);

            ctx.send(result);
        },

        // async webhook(ctx) {
        //     // const user = ctx.state.user;

        //     // if (!user) {
        //     //     return ctx.unauthorized("You are not authorized!");
        //     // }

        //     const signature = ctx.request.headers["stripe-signature"];

        //     const result = await strapi
        //         .service("api::order.order")
        //         .webhook(ctx, signature);

        //     ctx.send(result);
        // },

        async confirm(ctx) {
            const user = ctx.state.user;

            if (!user) {
                return ctx.unauthorized("You are not authorized!");
            }

            const contentType = strapi.contentType("api::order.order");
            const auth = { auth: ctx.state.auth };

            await strapi.contentAPI.validate.query(
                ctx.query,
                contentType,
                auth,
            );

            const sanitizedData: Record<string, any> =
                await strapi.contentAPI.sanitize.input(
                    ctx.request.body,
                    contentType,
                    auth,
                );

            const { checkoutSession } = sanitizedData.data;

            const result = await strapi
                .service("api::order.order")
                .confirm(user, checkoutSession);

            ctx.send(result);
        },
    }),
);
