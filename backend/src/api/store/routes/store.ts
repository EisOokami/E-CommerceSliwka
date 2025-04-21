/**
 * store router
 */

// import { factories } from "@strapi/strapi";

export default {
    routes: [
        {
            method: "GET",
            path: "/stores",
            handler: "store.find",
        },
        {
            method: "GET",
            path: "/stores/price-range",
            handler: "store.priceRange",
            config: {
                policies: [],
                auth: false, 
            },
        },
        {
            method: "GET",
            path: "/stores/filtered",
            handler: "store.filtered",
        },
        {
            method: "GET",
            path: "/stores/products-count",
            handler: "store.productsCount",
        },
    ]
}