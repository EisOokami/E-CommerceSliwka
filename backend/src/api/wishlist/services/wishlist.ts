/**
 * wishlist service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService(
    "api::wishlist.wishlist",
    ({ strapi }) => ({
        async findWishlistProductsData(params, user) {
            const { results, pagination } = await super.find(params);

            const wishlistData = await strapi
                .documents("api::wishlist.wishlist")
                .findMany({
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

            return { data: wishlistData, meta: { pagination } };
        },

        async createWishlistProductData(params, user, data) {
            const wishlistData = await strapi
                .documents("api::wishlist.wishlist")
                .create({
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

            return { data: wishlistData };
        },

        async deleteWishlistProductData(user, ctxParams) {
            await strapi.documents("api::wishlist.wishlist").delete({
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
                ? await strapi.documents("api::wishlist.wishlist").count({
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
    }),
);
