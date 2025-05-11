/**
 * product router
 */

// import { factories } from '@strapi/strapi';

// export default factories.createCoreRouter('api::product.product');

export default {
    routes: [
        {
            method: "GET",
            path: "/products",
            handler: "product.find",
        },
        {
            method: "GET",
            path: "/products/price-range",
            handler: "product.priceRange",
            config: {
                policies: [],
                auth: false, 
            },
        },
        {
            method: "GET",
            path: "/products/filtered",
            handler: "product.filtered",
        },
        {
            method: "GET",
            path: "/products/products-count",
            handler: "product.productsCount",
        },
    ]
}