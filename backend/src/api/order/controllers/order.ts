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

        async updateOrderAfterCheckout(ctx) {
            const user = ctx.state.user;

            if (!user) {
                return ctx.unauthorized("You are not authorized!");
            }

            const { isSuccess } = ctx.request.body.data;

            const result = await strapi
                .service("api::order.order")
                .updateOrderAfterCheckout(user, isSuccess);

            ctx.send(result);
        },
    }),
);
