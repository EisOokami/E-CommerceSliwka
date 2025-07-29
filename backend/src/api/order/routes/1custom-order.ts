export default {
    routes: [
        {
            method: "POST",
            path: "/orders/update-order-after-checkout",
            handler: "order.updateOrderAfterCheckout",
            config: {
                policies: ["global::consent"]
            }
        },
        {
            method: "POST",
            path: "/orders/webhook",
            handler: "order.webhook",
            config: {
                auth: false,
                body: {
                    type: "raw",
                },
                policies: ["global::consent"]
            }
        },
    ]
}