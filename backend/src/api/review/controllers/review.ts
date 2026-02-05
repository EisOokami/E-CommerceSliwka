/**
 * review controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
    "api::review.review",
    ({ strapi }) => ({
        async find(ctx) {
            await this.validateQuery(ctx);

            const sanitizedQueryParams = await this.sanitizeQuery(ctx);

            const { data, meta } = await strapi
                .service("api::review.review")
                .findReviewsData(sanitizedQueryParams);

            // const sanitizedResults = await this.sanitizeOutput(data, ctx);

            return this.transformResponse(data, meta);
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
                .service("api::review.review")
                .createReview(sanitizedQueryParams, user, sanitizedData.data);

            const sanitizedResults = await this.sanitizeOutput(
                result.data,
                ctx,
            );

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
                .service("api::review.review")
                .updateReviewData(
                    sanitizedQueryParams,
                    user,
                    sanitizedData.data,
                    ctx.params,
                );

            const sanitizedResults = await this.sanitizeOutput(
                result.data,
                ctx,
            );

            return this.transformResponse(sanitizedResults);
        },

        async delete(ctx) {
            const user = ctx.state.user;

            if (!user) {
                return ctx.unauthorized("You are not authorized!");
            }

            await this.validateQuery(ctx);

            const result = await strapi
                .service("api::review.review")
                .deleteReview(user, ctx.params);

            ctx.send(result);
        },

        async updateProductAverageRating(ctx) {
            const user = ctx.state.user;

            if (!user) {
                return ctx.unauthorized("You are not authorized!");
            }

            const contentType = strapi.contentType("api::review.review");
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

            const { productDocumentId } = sanitizedData.data;

            const result = await strapi
                .service("api::review.review")
                .updateProductAvg(productDocumentId);

            ctx.send(result);
        },
    }),
);
