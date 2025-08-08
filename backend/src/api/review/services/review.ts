/**
 * review service
 */

import { factories } from "@strapi/strapi";
const { yup, validateYupSchema } = require("@strapi/utils");

const reviewSchema = yup.object({
    description: yup
        .string()
        .required("Description must be between 3 and 1500 characters")
        .min(3, "Description must be between 3 and 1500 characters")
        .max(1500, "Description must be between 3 and 1500 characters"),

    rating: yup
        .number()
        .required("Please select a rating")
        .min(1, "Please select a rating")
        .max(5, "Please select a rating"),
    images: yup.mixed(),
});

const validateReviewBody = validateYupSchema(reviewSchema);

export default factories.createCoreService(
    "api::review.review",
    ({ strapi }) => ({
        async findReviewsData(params) {
            const { results, pagination } = await super.find(params);

            const reviewsData = await strapi
                .documents("api::review.review")
                .findMany({
                    populate: {
                        ...params.populate,
                        user: {
                            populate: {
                                avatar: {
                                    fields: ["url", "alternativeText"],
                                },
                            },
                            fields: ["username"],
                        },
                    },
                    filters: {
                        ...params.filters,
                    },
                    sort: params.sort,
                });

            return { data: reviewsData, meta: { pagination } };
        },

        async createReview(params, user, data) {
            await validateReviewBody(data);

            const reviewData = await strapi
                .documents("api::review.review")
                .create({
                    data: {
                        ...data,
                        user: user.id,
                    },
                    populate: {
                        ...params.populate,
                        user: {
                            populate: {
                                avatar: {
                                    fields: ["url", "alternativeText"],
                                },
                            },
                            fields: ["username"],
                        },
                    },
                    status: "published",
                });

            return { data: reviewData };
        },

        async updateReviewData(params, user, data, ctxParams) {
            await validateReviewBody(data);

            const reviewData = await strapi
                .documents("api::review.review")
                .update({
                    documentId: ctxParams.id,
                    data: {
                        ...data,
                        user: user.id,
                    },
                    populate: {
                        ...params.populate,
                        user: {
                            populate: {
                                avatar: {
                                    fields: ["url", "alternativeText"],
                                },
                            },
                            fields: ["username"],
                        },
                    },
                    filters: {
                        ...params.filters,
                        user: {
                            documentId: {
                                $eq: user.documentId,
                            },
                        },
                    },
                    sort: params.sort,
                    status: "published",
                });

            return { data: reviewData };
        },

        async deleteReview(user, ctxParams) {
            await strapi.documents("api::review.review").delete({
                documentId: ctxParams.id,
                filters: {
                    user: {
                        documentId: {
                            $eq: user.documentId,
                        },
                    },
                },
            });

            return { ok: true };
        },

        async updateProductAvg(productDocumentId) {
            if (!productDocumentId) {
                return;
            }

            const reviews = await strapi
                .documents("api::review.review")
                .findMany({
                    filters: {
                        product: {
                            documentId: {
                                $eq: productDocumentId,
                            },
                        },
                    },
                    populate: {
                        product: true,
                    },
                    fields: ["rating"],
                });

            const total = reviews.reduce(
                (accumulator, currentValue) =>
                    accumulator + currentValue.rating,
                0,
            );
            const average = reviews.length ? total / reviews.length : 0;
            const rounded = Math.round(average * 10) / 10;

            await strapi.documents("api::product.product").update({
                documentId: productDocumentId,
                data: { averageRating: rounded },
                status: "published",
            });

            return {
                averageRating: rounded,
                ok: true,
            };
        },
    }),
);
