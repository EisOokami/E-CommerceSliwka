/**
 * store service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService("api::store.store", ({ strapi }) => ({
    async getPriceRange(filters) {
        const products = await strapi.entityService.findMany("api::store.store", {
            filters,
            fields: ["price", "discountedPrice", "isDiscount"],
            limit: 1000,
        });
    
        const prices = products.map((product) =>
            product.isDiscount ? product.discountedPrice : product.price
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

        const products = await strapi.documents("api::store.store").findMany({
            filters: updatedFilters,
            populate: "*",
            start: (pagination.page - 1) * pagination.pageSize,
            limit: pagination.pageSize
        });

        const count = await strapi.documents("api::store.store").count({
            filters: updatedFilters,
            populate: "*",
            status: "published"
        });

        const totalPages = Math.ceil(count / pagination.pageSize)
    
        return {data: products, totalPages, productsCount: count };
    },

    async getCount() {
        const count = await strapi.documents("api::store.store").count({
            populate: "*",
            status: "published"
        });

        return {data: count}
    }
}))
