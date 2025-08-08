/**
 * review controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
    "api::review.review",
    ({ strapi }) => ({
        async find(ctx) {
            const params = (await this.sanitizeQuery(ctx)) as Record<
                string,
                any
            >;

            const result = await strapi
                .service("api::review.review")
                .findReviewsData(params);

            ctx.send(result);
        },

        async create(ctx) {
            const user = ctx.state.user;

            if (!user) {
                return ctx.unauthorized("You are not authorized!");
            }

            const params = (await this.sanitizeQuery(ctx)) as Record<
                string,
                any
            >;

            const result = await strapi
                .service("api::review.review")
                .createReview(params, user, ctx.request.body.data);

            ctx.send(result);
        },

        async update(ctx) {
            const user = ctx.state.user;

            if (!user) {
                return ctx.unauthorized("You are not authorized!");
            }

            const params = (await this.sanitizeQuery(ctx)) as Record<
                string,
                any
            >;

            const result = await strapi
                .service("api::review.review")
                .updateReviewData(
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
                .service("api::review.review")
                .deleteReview(user, ctx.params);

            ctx.send(result);
        },

        async updateProductAverageRating(ctx) {
            const user = ctx.state.user;

            if (!user) {
                return ctx.unauthorized("You are not authorized!");
            }

            const { productDocumentId } = ctx.request.body.data;

            const result = await strapi
                .service("api::review.review")
                .updateProductAvg(productDocumentId);

            ctx.send(result);
        },
    }),
);
