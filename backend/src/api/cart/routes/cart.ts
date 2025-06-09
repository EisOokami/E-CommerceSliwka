/**
 * cart router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::cart.cart', {
    config: {
        create: {
            policies: ["global::limit-user-cart"],
            middlewares: ["api::cart.rate-limit"],
        },
        delete: {
            middlewares: ["api::wishlist.rate-limit"],
        },
    }
});
