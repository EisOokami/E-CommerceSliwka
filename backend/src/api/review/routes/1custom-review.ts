export default {
    routes: [
        {
            method: "POST",
            path: "/reviews/update-product-average-rating",
            handler: "review.updateProductAverageRating",
        },
    ]
}