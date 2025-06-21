export default {
    routes: [
        {
            method: "POST",
            path: "/orders/update-order-after-checkout",
            handler: "order.updateOrderAfterCheckout",
        },
        {
            method: "POST",
            path: "/orders/webhook",
            handler: "order.webhook",
            config: {
                auth: false,
                body: {
                    type: "raw",
                }
            }
        },
    ]
}