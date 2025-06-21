/**
 * wishlist service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::wishlist.wishlist', ({ strapi }) => ({
    async getCount(user) {
        const count = user ? await strapi.documents("api::wishlist.wishlist").count({
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
