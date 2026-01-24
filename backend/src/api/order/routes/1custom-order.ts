export default {
    routes: [
        {
            method: "POST",
            path: "/orders/confirm",
            handler: "order.confirm",
            config: {
                policies: ["global::consent"],
            },
        },
        // {
        //     method: "POST",
        //     path: "/orders/webhook",
        //     handler: "order.webhook",
        //     config: {
        //         auth: false,
        //         body: {
        //             type: "raw",
        //         },
        //         policies: ["global::consent"]
        //     }
        // },
    ],
};
