"use client";

import { useEffect } from "react";
import useWishlistStore from "@/stores/wishlist";
import { getWishlistProductsData } from "@/data/loaders";
import { CardsComponentProps } from "./Card.interfaces";

import Card from "./Card";

export default function CardsComponent({
    productsData,
}: Readonly<CardsComponentProps>) {
    const wishlist = useWishlistStore((state) => state.wishlist);
    const setWishlist = useWishlistStore((state) => state.setWishlist);
    const setProductsInWishlist = useWishlistStore(
        (state) => state.setProductsInWishlist,
    );

    useEffect(() => {
        getWishlistProductsData().then((data) => {
            setWishlist(data);
        });
    }, [setWishlist]);

    useEffect(() => {
        if (wishlist.length) {
            setProductsInWishlist(
                wishlist.map((item) => item.product.documentId),
            );
        }
    }, [wishlist, setProductsInWishlist]);

    return productsData.map((product) => (
        <Card
            key={product.documentId}
            productDocumentId={product.documentId}
            imageSrc={product.image.url}
            imageAlt={product.image.alternativeText ?? product.name}
            name={product.name}
            price={product.price}
            isDiscount={product.isDiscount}
            discountedPrice={product.discountedPrice}
            averageRating={product.averageRating}
            reviewsCount={product.reviews ? product.reviews.length : 0}
            quantity={product.quantity}
            inStock={product.inStock}
            buttonHref={`/catalog/${product.slug}`}
        />
    ));
}
