/**
 * order router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::order.order', {
    config: {
        create: {
            policies: ["global::consent"]
        },
        delete: {
            policies: ["global::consent"]
        },
        update: {
            policies: ["global::consent"]
        },
        find: {
            policies: ["global::consent"]
        },
        findOne: {
            policies: ["global::consent"]
        }
    }
});
