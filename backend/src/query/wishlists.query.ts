import { wishlists } from "../db/schema.js";
import { defineQuery } from "../utils/query/defineQuery.js";

export const wishlistsQuery = defineQuery({
    populate: {
        user: {
            fields: ["id"],
        },
        product: { populate: { image: true } },
    },
    filters: {
        id: wishlists.id,
        createdAt: { column: wishlists.createdAt, kind: "date" },
        updatedAt: { column: wishlists.updatedAt, kind: "date" },
    },
    sort: {
        id: wishlists.id,
        createdAt: wishlists.createdAt,
        updatedAt: wishlists.updatedAt,
    },
});

