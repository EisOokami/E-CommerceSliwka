/**
 * product controller
 */

import { factories } from "@strapi/strapi"

export default factories.createCoreController("api::product.product", ({ strapi }) => ({
    async priceRange(ctx) {
        const filters = ctx.query.filters || {};
        const result = await strapi
            .service("api::product.product")
            .getPriceRange(filters);

        ctx.send(result);
    },

    async filtered(ctx) {
        const filters = ctx.query.filters || {};
        const queryParams = ctx.query.queryParams;
        const pagination = ctx.query.pagination;

        const result = await strapi
            .service("api::product.product")
            .getFilteredProducts(filters, queryParams, pagination);

        ctx.send(result);
    },

    async productsCount(ctx) {
        const result = await strapi
            .service("api::product.product")
            .getCount();

        ctx.send(result);
    }
}));