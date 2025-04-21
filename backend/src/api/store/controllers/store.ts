/**
 * store controller
 */

import { factories } from "@strapi/strapi"

export default factories.createCoreController("api::store.store", ({ strapi }) => ({
    async priceRange(ctx) {
        const filters = ctx.query.filters || {};
        const result = await strapi
            .service("api::store.store")
            .getPriceRange(filters);

        ctx.send(result);
    },

    async filtered(ctx) {
        const filters = ctx.query.filters || {};
        const queryParams = ctx.query.queryParams;
        const pagination = ctx.query.pagination;
        const result = await strapi
            .service("api::store.store")
            .getFilteredProducts(filters, queryParams, pagination);

        ctx.send(result);
    },

    async productsCount(ctx) {
        const result = await strapi
            .service("api::store.store")
            .getCount();

        ctx.send(result);
    }
}));
