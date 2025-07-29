/**
 * review router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::review.review', {
    config: {
        create: {
            policies: ["global::limit-user-review", "global::consent"],
        },
        delete: {
            policies: ["global::consent"],
        },
        update: {
            policies: ["global::consent"]
        }
    }
});
