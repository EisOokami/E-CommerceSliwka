/**
 * order service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::order.order', ({ strapi }) => ({
    async setStatus(user, isSuccess, deliveryStatus) {
        if (!user) {
            return;
        }

        const lastOrder = await strapi.documents("api::order.order").findMany({
            sort: "publishedAt:desc",
            limit: 1,
            populate: "*",
            filters: {
                user: {
                    id: {
                        $eq: user.id,
                    },
                }
            }
        })

        if (isSuccess) {
            const daysToAdd = Math.floor(Math.random() * 5) + 3;
            const estimatedDelivery = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000).toISOString();
    
            const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const prefix = letters[Math.floor(Math.random() * letters.length)] +
                            letters[Math.floor(Math.random() * letters.length)];
            const number = Math.floor(100000000 + Math.random() * 900000000); 
            const trackingNumber = `${prefix}${number}`;

            await strapi.documents("api::order.order").update({
                documentId: lastOrder[0].documentId,
                data: {
                    isSuccess,
                    deliveryStatus,
                    trackingNumber,
                    estimatedDelivery
                }
            })

            return {}
        }
            
        if (!isSuccess) {
            await strapi.documents("api::order.order").update({
                documentId: lastOrder[0].documentId,
                data: {
                    isSuccess,
                    deliveryStatus,
                }
            })
            
            return {}
        }
    }
}));
