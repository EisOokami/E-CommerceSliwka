/**
 * order controller
 */

const stripe = require("stripe")(process.env.STRIPE_KEY);

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::order.order', ({ strapi }) => ({
    async create(ctx) {
        const user = ctx.state.user;

        if (!user) {
            return ctx.unauthorized("You are not authorized!");
        }

        console.log(ctx.request.body.data);
        console.log(ctx.state.user.id);
        console.log("order controller");

        const { address, amount, dishes, token, city, state } = ctx.request.body.data;

        try {
            // Charge the customer
            await stripe.charges.create({
                amount: amount,
                currency: "usd",
                description: `Order ${new Date()} by ${ctx.state.user.id}`,
                source: token,
            });

            // Create the order
            const order = await strapi.service("api::order.order").create({
                data: {
                amount,
                address,
                dishes,
                city,
                state,
                token,
                user: ctx.state.user.id,
                },
            });

            return order;
        } catch (err) {
            console.log("err", err);
            ctx.response.status = 500;
            
            return {
                error: { message: "There was a problem creating the charge" },
                address,
                amount,
                dishes,
                token,
                city,
                state,
            };
        }
    },
}));
