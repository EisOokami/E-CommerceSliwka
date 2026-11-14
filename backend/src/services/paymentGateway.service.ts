import Stripe from "stripe";
import { ApiError } from "../utils/apiError.js";
import type { PaymentGateway } from "../types/types.js";

function stripe() {
    if (!process.env.STRIPE_KEY) {
        throw new ApiError({
            statusCode: 503,
            message: "Checkout is temporarily unavailable",
        });
    }

    return new Stripe(process.env.STRIPE_KEY, {
        timeout: 10000,
        maxNetworkRetries: 1,
    });
}

export const paymentGateway: PaymentGateway = {
    async create(input) {
        const frontend = process.env.FRONTEND_URL;

        if (!frontend) {
            throw new ApiError({
                statusCode: 503,
                message: "Checkout is temporarily unavailable",
            });
        }

        return stripe().checkout.sessions.create(
            {
                mode: "payment",
                automatic_tax: {
                    enabled: process.env.STRIPE_AUTOMATIC_TAX !== "false",
                },
                client_reference_id: input.orderId,
                customer_email: input.email,
                expires_at: input.expiresAt,
                success_url: `${frontend}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${frontend}/cancel`,
                payment_method_types: ["card"],
                line_items: input.lines.map((line) => ({
                    quantity: 1,
                    price_data: {
                        currency: "usd",
                        unit_amount: line.amount,
                        product_data: { name: line.name },
                    },
                })),
                shipping_address_collection: {
                    allowed_countries: [
                        "US",
                        "CA",
                        "GB",
                        "DE",
                        "FR",
                        "ES",
                        "IT",
                        "PL",
                        "UA",
                        "CZ",
                        "SK",
                        "NL",
                        "BE",
                        "AT",
                        "PT",
                        "IE",
                        "SE",
                        "DK",
                        "FI",
                        "NO",
                        "CH",
                        "AU",
                        "NZ",
                    ],
                },
                ...(process.env.STRIPE_SHIPPING_RATE_IDS
                    ? {
                          shipping_options:
                              process.env.STRIPE_SHIPPING_RATE_IDS.split(
                                  ",",
                              ).map((id) => ({ shipping_rate: id.trim() })),
                      }
                    : {}),
            },
            { idempotencyKey: input.orderId },
        );
    },
    retrieve: (id) => {
        return stripe().checkout.sessions.retrieve(id);
    },
    expire: (id) => {
        return stripe().checkout.sessions.expire(id);
    },
};
