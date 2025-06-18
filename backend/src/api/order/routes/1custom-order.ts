export default {
    routes: [
        {
            method: "POST",
            path: "/orders/set-status",
            handler: "order.setStatus",
        },
    ]
}