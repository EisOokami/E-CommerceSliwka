import { reviews } from "../db/schema.js";
import { defineQuery } from "../utils/query/defineQuery.js";

export const reviewsQuery = defineQuery({
    populate: {
        user: {
            fields: ["username", "avatarUrl"],
        },
    },
    filters: {
        id: reviews.id,
        rating: { column: reviews.rating, kind: "number" },
        publicationDate: { column: reviews.publicationDate, kind: "date" },
        lastEdited: { column: reviews.lastEdited, kind: "date" },
        createdAt: { column: reviews.createdAt, kind: "date" },
    },
    sort: {
        id: reviews.id,
        rating: reviews.rating,
        publicationDate: reviews.publicationDate,
        lastEdited: reviews.lastEdited,
        createdAt: reviews.createdAt,
    },
});
