/**
 * cart router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::cart.cart', {
    config: {
        create: {
            policies: ["global::limit-user-cart"],
        },
    }
});
