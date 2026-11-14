import { products } from "../db/schema.js";
import { defineQuery } from "../utils/query/defineQuery.js";

export const productsQuery = defineQuery({
    populate: {
        image: {
            fields: ["id", "fileUrl"],
        },
        sliderImages: {
            fields: ["id", "fileUrl"],
        },
        productVariants: true,
        options: {
            populate: {
                optionDetails: true,
            },
        },
        productInfos: true,
        productSpecifications: true,
        productSpecificationGroups: {
            populate: {
                specifications: true,
            },
        },
        reviews: {
            populate: {
                user: {
                    fields: ["username", "avatarUrl"],
                },
                product: {
                    fields: ["id"],
                },
                files: {
                    fields: ["fileUrl"],
                },
            },
        },
    },
    filters: {
        id: products.id,
        name: products.name,
        price: { column: products.price, kind: "number" },
        discountedPrice: { column: products.discountedPrice, kind: "number" },
        finalPrice: { column: products.finalPrice, kind: "number" },
        averageRating: products.averageRating,
        category: products.category,
        quantity: products.quantity,
        color: products.color,
        inStock: { column: products.inStock, kind: "boolean" },
        createdAt: { column: products.createdAt, kind: "date" },
    },
    sort: {
        id: products.id,
        name: products.name,
        price: products.price,
        discountedPrice: products.discountedPrice,
        finalPrice: products.finalPrice,
        averageRating: products.averageRating,
        category: products.category,
        quantity: products.quantity,
        color: products.color,
        inStock: products.inStock,
        createdAt: products.createdAt,
    },
});
