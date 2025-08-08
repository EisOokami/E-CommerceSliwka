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

        const params = (await this.sanitizeQuery(ctx)) as Record<string, any>;

        const result = await strapi
            .service("api::wishlist.wishlist")
            .findWishlistProductsData(params, user);

        ctx.send(result);
    },

    async create(ctx) {
        const user = ctx.state.user;

        if (!user) {
            return ctx.unauthorized("You are not authorized!");
        }

        const params = (await this.sanitizeQuery(ctx)) as Record<string, any>;

        const result = await strapi
            .service("api::wishlist.wishlist")
            .createWishlistProductData(params, user, ctx.request.body.data);

        ctx.send(result);
    },

    async delete(ctx) {
        const user = ctx.state.user;

        if (!user) {
            return ctx.unauthorized("You are not authorized!");
        }

        const result = await strapi
            .service("api::wishlist.wishlist")
            .deleteWishlistProductData(user, ctx.params);

        ctx.send(result);
    },

    async wishlistsCount(ctx) {
        const user = ctx.state.user;

        const result = await strapi
            .service("api::wishlist.wishlist")
            .getCount(user);

        ctx.send(result);
    },
});
