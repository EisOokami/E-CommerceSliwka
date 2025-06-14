/**
 * order controller
 */

const stripe = require("stripe")(process.env.STRIPE_KEY);

import { factories } from '@strapi/strapi'

export default factories.createCoreController("api::order.order", ({ strapi }) => ({
    async create(ctx) {
        const user = ctx.state.user;

        if (!user) {
            return ctx.unauthorized("You are not authorized!");
        }

        const { cartItems } = ctx.request.body.data;

        const lineItems = await Promise.all(
            cartItems.map(async (item) => {
                const product = await strapi.documents("api::product.product").findOne({
                    documentId: item.product.documentId,
                    populate: {
                        image: {
                            fields: ["url", "alternativeText"],
                        },
                    }
                });

                return {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: product.name,
                            images: [`${process.env.IMAGES_HOST}${product.image.url}`]
                        },
                        unit_amount: product.discountedPrice ? product.discountedPrice * 100 : product.price * 100
                    },
                    quantity: item.quantity
                }
            })
        )

        try {
            const session = await stripe.checkout.sessions.create({
                mode: "payment",
                success_url: `${process.env.CLIENT_URL}/cart/success`,
                cancel_url: `${process.env.CLIENT_URL}/cart/cancel`,
                line_items: lineItems,
                shipping_address_collection: {
                    allowed_countries: ["US", "CA", "MX", "BR", "GB", "IE", "ES", "PT", "BE", "NL", "DE", "CH", "IT", "AT", "DK", "NO", "SE", "FI", "PL", "LT", "LV", "EE", "UA", "CZ", "SK", "RO", "MD", "GR", "TR", "GE", "SI", "HR", "MK", "AL", "CY", "KR", "JP", "TW", "CN", "IN", "AU", "VN", "NZ", "LU", "LI", "MC", "AD", "GI", "IS", "ZA", "PH", "SG"]
                },
                shipping_options: [
                    { shipping_rate: "shr_1RZdM84gGy6w8QcPegrMLLq8" },
                    { shipping_rate: "shr_1RZdLG4gGy6w8QcPqxA0G0QV" },
                    { shipping_rate: "shr_1RZdLf4gGy6w8QcPJB16Gc20" },
                ],
                payment_method_types: ["card"],
                customer_email: ctx.state.user.email,
                automatic_tax: {
                    enabled: true
                }
            });

            await strapi.documents("api::order.order").create({
                data: {
                    cartItems,
                    stripeId: session.id,
                    user: ctx.state.user.documentId
                }
            })

            return {stripeSession: session}
        } catch (err) {
            console.log("err", err);
            ctx.response.status = 500;

            return err
        }
    },
}));
