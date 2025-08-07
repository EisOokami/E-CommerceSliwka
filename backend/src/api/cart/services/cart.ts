/**
 * cart service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService("api::cart.cart", ({ strapi }) => ({
    async findCartProductsData(params, user) {
        const { results, pagination } = await super.find(params);

        const cartData = await strapi.documents("api::cart.cart").findMany({
            populate: {
                ...params.populate,
                user: {
                    fields: ["id"],
                },
            },
            filters: {
                ...params.filters,
                user: {
                    documentId: {
                        $eq: user.documentId,
                    },
                },
            },
            sort: params.sort,
        });

        return { data: cartData, meta: { pagination } };
    },

    async findCartProductData(params, user, ctxParams) {
        const cartData = await strapi.documents("api::cart.cart").findOne({
            documentId: ctxParams.id,
            populate: {
                ...params.populate,
                user: {
                    fields: ["id"],
                },
            },
            filters: {
                ...params.filters,
                user: {
                    documentId: {
                        $eq: user.documentId,
                    },
                },
            },
            sort: params.sort,
        });

        return { data: cartData };
    },

    async createCartProductData(params, user, data) {
        const cartData = await strapi.documents("api::cart.cart").create({
            data: {
                ...data,
                user: user.id,
            },
            populate: {
                ...params.populate,
                user: {
                    fields: ["id"],
                },
            },
            status: "published",
        });

        return { data: cartData };
    },

    async updateCartProductData(params, user, data, ctxParams) {
        const cartData = await strapi.documents("api::cart.cart").update({
            documentId: ctxParams.id,
            data: {
                ...data,
                user: user.id,
            },
            populate: {
                ...params.populate,
                user: {
                    fields: ["id"],
                },
            },
            filters: {
                ...params.filters,
                user: {
                    documentId: {
                        $eq: user.documentId,
                    },
                },
            },
            sort: params.sort,
            status: "published",
        });

        return { data: cartData };
    },

    async deleteCartProductData(user, ctxParams) {
        await strapi.documents("api::cart.cart").delete({
            documentId: ctxParams.id,
            filters: {
                user: {
                    documentId: {
                        $eq: user.documentId,
                    },
                },
            },
        });

        return { ok: true };
    },

    async getCount(user) {
        const count = user
            ? await strapi.documents("api::cart.cart").count({
                  populate: "*",
                  status: "published",
                  filters: {
                      user: {
                          id: {
                              $eq: user.id,
                          },
                      },
                  },
              })
            : 0;

        return { data: count };
    },
}));
