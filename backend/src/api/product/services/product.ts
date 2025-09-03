/**
 * product service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService(
    "api::product.product",
    ({ strapi }) => ({
        async findProducts(params) {
            const { results, pagination } = await super.find(params);

            const productData = await strapi
                .documents("api::product.product")
                .findMany({
                    populate: {
                        ...params.populate,
                        reviews: {
                            populate: {
                                user: {
                                    populate: {
                                        avatar: {
                                            fields: ["url", "alternativeText"],
                                        },
                                    },
                                    fields: ["username"],
                                },
                                product: {
                                    fields: ["documentId"],
                                },
                                images: {
                                    fields: ["url", "alternativeText"],
                                },
                            },
                            sort: "createdAt:desc",
                        },
                    },
                    filters: params.filters,
                    sort: params.sort,
                    ...(params.pagination &&
                        params.pagination.page &&
                        params.pagination.pageSize && {
                            start:
                                (params.pagination.page - 1) *
                                params.pagination.pageSize,
                        }),
                    ...(params.pagination &&
                        params.pagination.pageSize && {
                            limit: params.pagination.pageSize,
                        }),
                });

            return { data: productData, meta: { pagination } };
        },

        async getPriceRange(filters) {
            const products = await strapi
                .documents("api::product.product")
                .findMany({
                    filters,
                    fields: ["price", "discountedPrice", "isDiscount"],
                    limit: 1000,
                });

            const prices = products.map((product) =>
                product.isDiscount && product.discountedPrice
                    ? product.discountedPrice
                    : product.price,
            );

            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);

            return { minPrice, maxPrice };
        },

        async getFilteredProducts(filters, queryParams, pagination, sort) {
            const updatedFilters = {
                ...filters,
                ...(queryParams.price?.length === 2 && {
                    $or: [
                        {
                            discountedPrice: {
                                $between: [
                                    +queryParams.price[0],
                                    +queryParams.price[1],
                                ],
                            },
                        },
                        {
                            price: {
                                $between: [
                                    +queryParams.price[0],
                                    +queryParams.price[1],
                                ],
                            },
                        },
                    ],
                }),
            };

            const populateFields = {
                image: true,
                sliderImages: true,
                productOptions: true,
                colors: true,
                options: true,
                productInfo: true,
                productSpecs: true,
                category: true,
                reviews: true,
                detailedSpecifications: {
                    populate: {
                        specifications: {
                            populate: {
                                specifications: true,
                            },
                        },
                    },
                },
            };

            const products = await strapi
                .documents("api::product.product")
                .findMany({
                    filters: updatedFilters,
                    populate: populateFields,
                    start: (pagination.page - 1) * pagination.pageSize,
                    limit: pagination.pageSize,
                    sort: sort,
                });

            const count = await strapi.documents("api::product.product").count({
                filters: updatedFilters,
                populate: "*",
                status: "published",
            });

            const totalPages = Math.ceil(count / pagination.pageSize);

            return { data: products, totalPages, productsCount: count };
        },

        async getCount() {
            const count = await strapi.documents("api::product.product").count({
                populate: "*",
                status: "published",
            });

            return { data: count };
        },
    }),
);
