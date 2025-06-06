import utils from '@strapi/utils';
const { PolicyError } = utils.errors;

export default async (policyContext, config, { strapi }) => {
    const userId = policyContext.state.user.id;

    const postCount = await strapi.documents("api::cart.cart").count({
        filters: { user: userId },
    });

    if (postCount >= 5) {
        throw new PolicyError("You can add a maximum of 5 products to your cart", 'PostLimitReached')
    }

    return true;
};
