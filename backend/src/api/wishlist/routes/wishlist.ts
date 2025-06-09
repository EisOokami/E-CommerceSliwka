/**
 * wishlist router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::wishlist.wishlist', {
    config: {
        create: {
            policies: ["global::limit-user-wishlist"],
            middlewares: ["api::wishlist.rate-limit"],
        },
        delete: {
            middlewares: ["api::wishlist.rate-limit"],
        }
    }
});