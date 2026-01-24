/**
 * wishlist controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::wishlist.wishlist", {
    async find(ctx) {
        const user = ctx.state.user;

        if (!user) {
            return ctx.unauthorized("You are not authorized!");
        }

        await this.validateQuery(ctx);

        const sanitizedQueryParams = await this.sanitizeQuery(ctx);

        const { data, meta } = await strapi
            .service("api::wishlist.wishlist")
            .findWishlistProductsData(sanitizedQueryParams, user);

        const sanitizedResults = await this.sanitizeOutput(data, ctx);

        return this.transformResponse(sanitizedResults, meta);
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
            .service("api::wishlist.wishlist")
            .createWishlistProductData(
                sanitizedQueryParams,
                user,
                sanitizedData.data,
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
            .service("api::wishlist.wishlist")
            .deleteWishlistProductData(user, ctx.params);

        ctx.send(result);
    },

    async wishlistsCount(ctx) {
        const user = ctx.state.user;

        if (!user) {
            return ctx.unauthorized("You are not authorized!");
        }

        const contentType = strapi.contentType("api::wishlist.wishlist");
        const auth = { auth: ctx.state.auth };

        await strapi.contentAPI.validate.query(ctx.query, contentType, auth);

        const result = await strapi
            .service("api::wishlist.wishlist")
            .getCount(user);

        ctx.send(result);
    },
});
