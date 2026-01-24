/**
 * product controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
    "api::product.product",
    ({ strapi }) => ({
        async find(ctx) {
            await this.validateQuery(ctx);

            const sanitizedQueryParams = await this.sanitizeQuery(ctx);

            const { data, meta } = await strapi
                .service("api::product.product")
                .findProducts(sanitizedQueryParams);

            return this.transformResponse(data, meta);
        },

        async priceRange(ctx) {
            const contentType = strapi.contentType("api::product.product");

            await strapi.contentAPI.validate.query(ctx.query, contentType);

            const sanitizedQueryParams: Record<string, any> =
                await strapi.contentAPI.sanitize.query(ctx.query, contentType);

            const filters = sanitizedQueryParams.filters || {};

            const result = await strapi
                .service("api::product.product")
                .getPriceRange(filters);

            ctx.send(result);
        },

        async filtered(ctx) {
            const contentType = strapi.contentType("api::product.product");

            await strapi.contentAPI.validate.query(ctx.query, contentType);

            const sanitizedQueryParams: Record<string, any> =
                await strapi.contentAPI.sanitize.query(ctx.query, contentType);

            const filters = sanitizedQueryParams.filters || {};
            const queryParams = sanitizedQueryParams.queryParams;
            const pagination = sanitizedQueryParams.pagination;
            const sort = sanitizedQueryParams.sort;

            const { data, totalPages, productsCount } = await strapi
                .service("api::product.product")
                .getFilteredProducts(filters, queryParams, pagination, sort);

            const sanitizedResults = await strapi.contentAPI.sanitize.output(
                data,
                contentType,
            );

            ctx.send({ data: sanitizedResults, totalPages, productsCount });
        },

        async productsCount(ctx) {
            const contentType = strapi.contentType("api::product.product");

            await strapi.contentAPI.validate.query(ctx.query, contentType);

            const result = await strapi
                .service("api::product.product")
                .getCount();

            ctx.send(result);
        },
    }),
);
