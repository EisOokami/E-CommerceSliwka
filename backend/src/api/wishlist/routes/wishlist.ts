/**
 * wishlist router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::wishlist.wishlist', {
    config: {
        create: {
            policies: ["global::limit-user-wishlist", "global::consent"],
            middlewares: ["api::wishlist.rate-limit"],
        },
        delete: {
            policies: ["global::consent"],
            middlewares: ["api::wishlist.rate-limit"],
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