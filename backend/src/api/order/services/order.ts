/**
 * order service
 */

import { factories } from "@strapi/strapi";
const stripe = require("stripe")(process.env.STRIPE_KEY);

export default factories.createCoreService(
    "api::order.order",
    ({ strapi }) => ({
        async createOrder(cartItems, user, ctx) {
            const lineItems = await Promise.all(
                cartItems.map(async (item) => {
                    const product = await strapi
                        .documents("api::product.product")
                        .findOne({
                            documentId: item.product.documentId,
                            populate: {
                                image: {
                                    fields: ["url", "alternativeText"],
                                },
                            },
                        });
                    const color = item.color
                        ? await strapi.documents("api::color.color").findOne({
                              documentId: item.color.documentId,
                          })
                        : null;
                    const option = item.option
                        ? await strapi.documents("api::option.option").findOne({
                              documentId: item.option.documentId,
                          })
                        : null;
                    const quantity = await strapi
                        .documents("api::cart.cart")
                        .findOne({
                            documentId: item.documentId,
                            fields: ["quantity"],
                        });

                    const optionPrice = option ? option.priceDifference : 0;
                    const colorPrice = color ? color.priceDifference : 0;

                    return {
                        price_data: {
                            currency: "usd",
                            product_data: {
                                name: product.name,
                                description:
                                    (option ? `Option: ${option.value} ` : "") +
                                    (color ? `Color: ${color.colorName}` : ""),
                                images: [
                                    `${process.env.IMAGES_HOST}${product.image.url}`,
                                ],
                            },
                            unit_amount:
                                product.isDiscount && product.discountedPrice
                                    ? (product.discountedPrice +
                                          optionPrice +
                                          colorPrice) *
                                      100
                                    : (product.price +
                                          optionPrice +
                                          colorPrice) *
                                      100,
                        },
                        quantity: quantity.quantity,
                    };
                }),
            );

            try {
                const session = await stripe.checkout.sessions.create({
                    mode: "payment",
                    success_url: `${process.env.CLIENT_URL}/cart/success`,
                    cancel_url: `${process.env.CLIENT_URL}/cart/cancel`,
                    line_items: lineItems,
                    shipping_address_collection: {
                        allowed_countries: [
                            "US",
                            "CA",
                            "MX",
                            "BR",
                            "GB",
                            "IE",
                            "ES",
                            "PT",
                            "BE",
                            "NL",
                            "DE",
                            "CH",
                            "IT",
                            "AT",
                            "DK",
                            "NO",
                            "SE",
                            "FI",
                            "PL",
                            "LT",
                            "LV",
                            "EE",
                            "UA",
                            "CZ",
                            "SK",
                            "RO",
                            "MD",
                            "GR",
                            "TR",
                            "GE",
                            "SI",
                            "HR",
                            "MK",
                            "AL",
                            "CY",
                            "KR",
                            "JP",
                            "TW",
                            "CN",
                            "IN",
                            "AU",
                            "VN",
                            "NZ",
                            "LU",
                            "LI",
                            "MC",
                            "AD",
                            "GI",
                            "IS",
                            "ZA",
                            "PH",
                            "SG",
                        ],
                    },
                    shipping_options: [
                        { shipping_rate: "shr_1RZdM84gGy6w8QcPegrMLLq8" },
                        { shipping_rate: "shr_1RZdLG4gGy6w8QcPqxA0G0QV" },
                        { shipping_rate: "shr_1RZdLf4gGy6w8QcPJB16Gc20" },
                    ],
                    payment_method_types: ["card"],
                    customer_email: user.email,
                    automatic_tax: {
                        enabled: true,
                    },
                });

                const timestamp = Date.now().toString(36);
                const random = Math.random()
                    .toString(36)
                    .substring(2, 8)
                    .toUpperCase();
                const orderId = `ORD-${timestamp}-${random}`;

                await strapi.documents("api::order.order").create({
                    data: {
                        orderId,
                        cartItems,
                        stripeId: session.id,
                        user: user.documentId,
                    },
                    status: "published",
                });

                return { stripeSession: session };
            } catch (err) {
                console.log("err", err);
                ctx.response.status = 500;

                return err;
            }
        },

        async findOrder(params, user) {
            const { results, pagination } = await super.find(params);

            const orderData = await strapi
                .documents("api::order.order")
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
                    fields: params.fields,
                    sort: params.sort,
                });

            return { data: orderData, meta: { pagination } };
        },

        async webhook(ctx, signature) {
            let event;

            try {
                event = stripe.webhooks.constructEvent(
                    ctx.request.body,
                    signature,
                    process.env.STRIPE_WEBHOOK_SECRET,
                );
            } catch (err) {
                console.log(
                    "Webhook signature verification failed",
                    err.message,
                );
                ctx.status = 400;

                return (ctx.body = `Webhook Error: ${err.message}`);
            }

            if (event.type === "checkout.session.completed") {
                const session = event.data.object;

                const order = await strapi
                    .documents("api::order.order")
                    .findFirst({
                        filters: {
                            stripeId: {
                                $eq: session.id,
                            },
                        },
                    });

                await strapi.documents("api::order.order").update({
                    documentId: order.documentId,
                    data: { isSuccess: true },
                });

                console.log("Order marked as success:", session.id);
            }

            if (event.type === "checkout.session.expired") {
                const session = event.data.object;

                const order = await strapi
                    .documents("api::order.order")
                    .findFirst({
                        filters: {
                            stripeId: {
                                $eq: session.id,
                            },
                        },
                    });

                await strapi.documents("api::order.order").update({
                    documentId: order.documentId,
                    data: { isSuccess: true },
                });

                console.log("Order marked as cancelled:", session.id);
            }

            return { received: true };
        },

        async updateOrderAfterCheckout(user, isSuccess) {
            if (!user) {
                return;
            }

            const lastOrder = await strapi
                .documents("api::order.order")
                .findMany({
                    sort: "createdAt:desc",
                    limit: 1,
                    populate: "*",
                    filters: {
                        user: {
                            documentId: {
                                $eq: user.documentId,
                            },
                        },
                    },
                });

            if (isSuccess) {
                const daysToAdd = Math.floor(Math.random() * 5) + 3;
                const estimatedDelivery = new Date(
                    Date.now() + daysToAdd * 24 * 60 * 60 * 1000,
                ).toISOString();

                const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                const prefix =
                    letters[Math.floor(Math.random() * letters.length)] +
                    letters[Math.floor(Math.random() * letters.length)];
                const number = Math.floor(
                    100000000 + Math.random() * 900000000,
                );
                const trackingNumber = `${prefix}${number}`;

                await strapi.documents("api::order.order").update({
                    documentId: lastOrder[0].documentId,
                    data: {
                        isSuccess,
                        deliveryStatus: "Processing",
                        trackingNumber,
                        estimatedDelivery,
                    },
                    filters: {
                        user: {
                            documentId: {
                                $eq: user.documentId,
                            },
                        },
                    },
                    status: "published",
                });

                return {};
            }

            if (!isSuccess) {
                await strapi.documents("api::order.order").update({
                    documentId: lastOrder[0].documentId,
                    data: {
                        isSuccess,
                        deliveryStatus: "Cancelled",
                    },
                    filters: {
                        user: {
                            documentId: {
                                $eq: user.documentId,
                            },
                        },
                    },
                    status: "published",
                });

                return {};
            }
        },
    }),
);
