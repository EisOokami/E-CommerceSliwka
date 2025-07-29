/**
 * cart router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::cart.cart', {
    config: {
        create: {
            policies: ["global::limit-user-cart", "global::consent"],
            middlewares: ["api::cart.rate-limit"],
        },
        delete: {
            middlewares: ["api::wishlist.rate-limit"],
            policies: ["global::consent"]
        },
        find: {
            policies: ["global::consent"]
        },
        findOne: {
            policies: ["global::consent"]
        },
        update: {
            policies: ["global::consent"]
        }
    }
});
