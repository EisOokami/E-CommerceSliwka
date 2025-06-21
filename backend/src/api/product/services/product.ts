/**
 * product service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService("api::product.product", ({ strapi }) => ({
    async getPriceRange(filters) {
        const products = await strapi.entityService.findMany("api::product.product", {
            filters,
            fields: ["price", "discountedPrice", "isDiscount"],
            limit: 1000,
        });
    
        const prices = products.map((product) =>
            product.isDiscount && product.discountedPrice ? product.discountedPrice : product.price
        );
        
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
    
        return { minPrice, maxPrice };
    },

    async getFilteredProducts(filters, queryParams, pagination) {
        const updatedFilters = {
            ...filters,
            ...(queryParams.price?.length === 2 && {
                finalPrice: {
                    $between: [+queryParams.price[0], +queryParams.price[1]],
                },
            }),
        }

        const populateFields = {
            image: true,
            sliderImages: true,
            colors: true,
            options: true,
            productInfo: true,
            productSpecs: true,
            category: true,
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

        const products = await strapi.documents("api::product.product").findMany({
            filters: updatedFilters,
            populate: populateFields,
            start: (pagination.page - 1) * pagination.pageSize,
            limit: pagination.pageSize
        });

        const count = await strapi.documents("api::product.product").count({
            filters: updatedFilters,
            populate: "*",
            status: "published"
        });

        const totalPages = Math.ceil(count / pagination.pageSize)
    
        return {data: products, totalPages, productsCount: count };
    },

    async getCount() {
        const count = await strapi.documents("api::product.product").count({
            populate: "*",
            status: "published"
        });

        return {data: count}
    }
}))