export default [
    "strapi::logger",
    "strapi::errors",
    "strapi::security",
    {
        name: "strapi::cors",
        config: {
            origin: process.env.CORS_ORIGIN?.split(",") || [],
            keepHeaderOnError: true,
        },
    },
    "strapi::poweredBy",
    "strapi::query",
    "global::raw-body",
    "strapi::body",
    "strapi::session",
    "strapi::favicon",
    "strapi::public",
    "global::rate-limit",
    "global::ip-rate-limit",
    "global::csrf",
];
