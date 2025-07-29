export default {
    routes: [
        {
            method: "GET",
            path: "/carts/carts-count",
            handler: "cart.cartsCount",
            config: {
                policies: ["global::consent"]
            }
        },
    ]
}