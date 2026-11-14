"use client";

import { toast } from "sonner";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import useWishlistStore from "@/stores/wishlist";
import { getWishlistProductsData } from "@/data/main/loaders";
import { CardsComponentProps } from "./Card.interfaces";

import CardSkeleton from "./CardSkeleton";

const Card = dynamic(() => import("./Card"), {
    ssr: false,
    loading: () => <CardSkeleton />,
});

export default function CardsComponent({
    productsData,
}: Readonly<CardsComponentProps>) {
    const setWishlist = useWishlistStore((state) => state.setWishlist);
    const setProductsInWishlist = useWishlistStore(
        (state) => state.setProductsInWishlist,
    );

    useEffect(() => {
        let active = true;

        (async () => {
            const result = await getWishlistProductsData();

            if (!active) {
                return;
            }

            setWishlist(result);
            setProductsInWishlist(result.map((item) => item.product.id));
        })().catch(() => {
            if (active) {
                toast.error("Wishlist could not be loaded.");
            }
        });

        return () => {
            active = false;
        };
    }, [setProductsInWishlist, setWishlist]);

    return productsData.map((product) => (
        <Card
            key={product.id}
            productDocumentId={product.id}
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
