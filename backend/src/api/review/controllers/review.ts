/**
 * review controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::review.review', ({ strapi }) => ({
    async updateProductAverageRating(ctx) {
        const user = ctx.state.user

        if (!user) {
            return ctx.unauthorized("You are not authorized!");
        }

        const { productDocumentId } = ctx.request.body.data;

        const result = await strapi
            .service("api::review.review")
            .updateProductAvg(productDocumentId);

        ctx.send(result);
    }
}));
