/**
 * wishlist controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::wishlist.wishlist', {
    async wishlistsCount(ctx) {
        const user = ctx.state.user

        const result = await strapi
            .service("api::wishlist.wishlist")
            .getCount(user);

        ctx.send(result);
    }
});
