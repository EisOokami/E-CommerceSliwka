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

        await this.validateQuery(ctx);

        const sanitizedQueryParams = await this.sanitizeQuery(ctx);

        const { data, meta } = await strapi
            .service("api::cart.cart")
            .findCartProductsData(sanitizedQueryParams, user);

        const sanitizedResults = await this.sanitizeOutput(data, ctx);

        return this.transformResponse(sanitizedResults, meta);
    },

    async findOne(ctx) {
        const user = ctx.state.user;

        if (!user) {
            return ctx.unauthorized("You are not authorized!");
        }

        await this.validateQuery(ctx);

        const sanitizedQueryParams = await this.sanitizeQuery(ctx);

        const result = await strapi
            .service("api::cart.cart")
            .findCartProductData(sanitizedQueryParams, user, ctx.params);

        const sanitizedResults = await this.sanitizeOutput(result.data, ctx);

        return this.transformResponse(sanitizedResults);
    },

    async create(ctx) {
        const user = ctx.state.user;

        if (!user) {
            return ctx.unauthorized("You are not authorized!");
        }

        await this.validateQuery(ctx);

        const sanitizedQueryParams = await this.sanitizeQuery(ctx);

        const sanitizedData: Record<string, any> = await this.sanitizeInput(
            ctx.request.body,
            ctx,
        );

        const result = await strapi
            .service("api::cart.cart")
            .createCartProductData(
                sanitizedQueryParams,
                user,
                sanitizedData.data,
            );

        const sanitizedResults = await this.sanitizeOutput(result.data, ctx);

        return this.transformResponse(sanitizedResults);
    },

    async update(ctx) {
        const user = ctx.state.user;

        if (!user) {
            return ctx.unauthorized("You are not authorized!");
        }

        await this.validateQuery(ctx);

        const sanitizedQueryParams = await this.sanitizeQuery(ctx);

        const sanitizedData: Record<string, any> = await this.sanitizeInput(
            ctx.request.body,
            ctx,
        );

        const result = await strapi
            .service("api::cart.cart")
            .updateCartProductData(
                sanitizedQueryParams,
                user,
                sanitizedData.data,
                ctx.params,
            );

        const sanitizedResults = await this.sanitizeOutput(result.data, ctx);

        return this.transformResponse(sanitizedResults);
    },

    async delete(ctx) {
        const user = ctx.state.user;

        if (!user) {
            return ctx.unauthorized("You are not authorized!");
        }

        await this.validateQuery(ctx);

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

        const contentType = strapi.contentType("api::cart.cart");
        const auth = { auth: ctx.state.auth };

        await strapi.contentAPI.validate.query(ctx.query, contentType, auth);

        const result = await strapi.service("api::cart.cart").getCount(user);

        ctx.send(result);
    },
});
