/**
 * cart service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::cart.cart', ({ strapi }) => ({
    async getCount(user) {
        const count = user ? await strapi.documents("api::cart.cart").count({
            populate: "*",
            status: "published",
            filters: { 
                user: { 
                    id: { 
                        $eq: user.id 
                    } 
                } 
            } 
        }) : 0;

        return {data: count}
    }
}));
