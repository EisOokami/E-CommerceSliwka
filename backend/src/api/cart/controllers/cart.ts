/**
 * cart controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::cart.cart", {
    async find(ctx) {
        const user = ctx.state.user;

        if (!user) {
            return ctx.unauthorized("You are not authorized!");
        }

        const params = (await this.sanitizeQuery(ctx)) as Record<string, any>;

        const result = await strapi
            .service("api::cart.cart")
            .findCartProductsData(params, user);

        ctx.send(result);
    },

    async findOne(ctx) {
        const user = ctx.state.user;

        if (!user) {
            return ctx.unauthorized("You are not authorized!");
        }

        const params = (await this.sanitizeQuery(ctx)) as Record<string, any>;

        const result = await strapi
            .service("api::cart.cart")
            .findCartProductData(params, user, ctx.params);

        ctx.send(result);
    },

    async create(ctx) {
        const user = ctx.state.user;

        if (!user) {
            return ctx.unauthorized("You are not authorized!");
        }

        const params = (await this.sanitizeQuery(ctx)) as Record<string, any>;

        const result = await strapi
            .service("api::cart.cart")
            .createCartProductData(params, user, ctx.request.body.data);

        ctx.send(result);
    },

    async update(ctx) {
        const user = ctx.state.user;

        if (!user) {
            return ctx.unauthorized("You are not authorized!");
        }

        const params = (await this.sanitizeQuery(ctx)) as Record<string, any>;

        const result = await strapi
            .service("api::cart.cart")
            .updateCartProductData(
                params,
                user,
                ctx.request.body.data,
                ctx.params,
            );

        ctx.send(result);
    },

    async delete(ctx) {
        const user = ctx.state.user;

        if (!user) {
            return ctx.unauthorized("You are not authorized!");
        }

        const result = await strapi
            .service("api::cart.cart")
            .deleteCartProductData(user, ctx.params);

        ctx.send(result);
    },

    async cartsCount(ctx) {
        const user = ctx.state.user;

        if (!user) {
            return ctx.unauthorized("You are not authorized!");
        }

        const result = await strapi.service("api::cart.cart").getCount(user);

        ctx.send(result);
    },
});
