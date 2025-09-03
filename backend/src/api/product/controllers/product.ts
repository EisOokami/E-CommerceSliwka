/**
 * product controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
    "api::product.product",
    ({ strapi }) => ({
        async find(ctx) {
            const params = (await this.sanitizeQuery(ctx)) as Record<
                string,
                any
            >;

            const result = await strapi
                .service("api::product.product")
                .findProducts(params);

            ctx.send(result);
        },

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
            const sort = ctx.query.sort;

            const result = await strapi
                .service("api::product.product")
                .getFilteredProducts(filters, queryParams, pagination, sort);

            ctx.send(result);
        },

        async productsCount(ctx) {
            const result = await strapi
                .service("api::product.product")
                .getCount();

            ctx.send(result);
        },
    }),
);
