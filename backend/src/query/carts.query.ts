import { carts } from "../db/schema.js";
import { defineQuery } from "../utils/query/defineQuery.js";

export const cartsQuery = defineQuery({
    populate: {
        product: {
            populate: {
                image: true,
            },
        },
    },
    filters: {
        id: carts.id,
        quantity: carts.quantity,
    },
    sort: {
        id: carts.id,
        quantity: carts.quantity,
    },
});
