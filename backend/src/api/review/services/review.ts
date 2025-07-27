/**
 * review service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::review.review', ({ strapi }) => ({
    async updateProductAvg(productDocumentId) {
        if (!productDocumentId) {
            return;
        }

        const reviews = await strapi.documents("api::review.review").findMany({
            filters: { 
                product: {
                    documentId: {
                        $eq: productDocumentId
                    }
                }
            },
            populate: {
                product: true
            },
            fields: ["rating"],
        });

        const total = reviews.reduce((accumulator, currentValue) => accumulator + currentValue.rating, 0);
        const average = reviews.length ? total / reviews.length : 0;
        const rounded = Math.round(average * 10) / 10;

        await strapi.documents("api::product.product").update({
            documentId: productDocumentId,
            data: { averageRating: rounded },
            status: "published"
        });

        return { 
            averageRating: rounded, 
            ok: true 
        }
    }
}));