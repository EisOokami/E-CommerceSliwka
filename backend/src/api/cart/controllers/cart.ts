/**
 * cart controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::cart.cart', {
    async cartsCount(ctx) {
        const user = ctx.state.user

        const result = await strapi
            .service("api::cart.cart")
            .getCount(user);

        ctx.send(result);
    }
});
