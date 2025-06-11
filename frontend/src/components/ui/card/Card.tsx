"use client";

import { useEffect, useState } from "react";
import useWishlistStore from "@/stores/wishlist";
import Link from "next/link";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import {
    addProductToWishlistAction,
    deleteProductFromWishlistAction,
} from "@/data/actions/productActions";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { CardProps } from "./Card.interfaces";

import Button from "@/components/ui/button/Button";

export default function Card({
    productDocumentId,
    imageSrc,
    imageAlt,
    imageWidth,
    imageHeight,
    title,
    price,
    buttonHref,
    buttonTheme,
    buttonText,
    buttonInline,
    buttonClassName,
}: Readonly<CardProps>) {
    const wishlist = useWishlistStore((state) => state.wishlist);
    const setProductsInWishlist = useWishlistStore(
        (state) => state.setProductsInWishlist,
    );
    const productsInWishlist = useWishlistStore(
        (state) => state.productsInWishlist,
    );
    const [wishlistDocumentId, setWishlistDocumentId] = useState<
        string | undefined
    >(undefined);

    useEffect(() => {
        if (wishlist.length) {
            setWishlistDocumentId(
                wishlist.find(
                    (wishlist) =>
                        wishlist.product.documentId === productDocumentId,
                )?.documentId,
            );
        }
    }, [productDocumentId, wishlist]);

    const handleAddProductToWishlist = async () => {
        const result = await addProductToWishlistAction(productDocumentId);

        if (result.ok) {
            setProductsInWishlist([...productsInWishlist, productDocumentId]);

            toast.success(result.message, {
                position: "bottom-right",
                className: "text-xl border-l-8 border-green-500",
            });
        }

        if (!result.ok) {
            toast.error(result.message, {
                position: "bottom-right",
                className: "text-xl border-l-8 border-red-500",
            });
        }
    };

    const handleDeleteProductFromWishlist = async () => {
        if (!wishlistDocumentId) {
            return;
        }

        const result = await deleteProductFromWishlistAction(
            wishlistDocumentId,
        );

        if (result.ok) {
            setProductsInWishlist(
                productsInWishlist.filter(
                    (documentId) => documentId !== productDocumentId,
                ),
            );

            toast.success(result.message, {
                position: "bottom-right",
                className: "text-xl border-l-8 border-green-500",
            });
        }

        if (!result.ok) {
            toast.error(result.message, {
                position: "bottom-right",
                className: "text-xl border-l-8 border-red-500",
            });
        }
    };

    return (
        <div className="group relative grid justify-items-center gap-3 xl:min-h-[500px] p-3 md:p-8 bg-gray-100 rounded-md hover:shadow-lg cursor-pointer transition">
            <div className="absolute top-3 right-3 z-10">
                {productsInWishlist.includes(productDocumentId) ? (
                    <div
                        className="h-min p-3 bg-white hover:bg-white/50 rounded-full transition hover:scale-105"
                        onClick={handleDeleteProductFromWishlist}
                    >
                        <GoHeartFill className="text-2xl md:text-3xl text-red-500" />
                    </div>
                ) : (
                    <div
                        className="h-min p-3 bg-white/50 hover:bg-white rounded-full transition hover:scale-105"
                        onClick={handleAddProductToWishlist}
                    >
                        <GoHeart className="text-2xl md:text-3xl text-gray-500" />
                    </div>
                )}
            </div>
            <Link
                href={buttonHref}
                className="grid grid-rows-[min-content_1fr]"
            >
                <div className="grid place-content-center ">
                    <Image
                        src={imageSrc}
                        alt={imageAlt}
                        width={imageWidth}
                        height={imageHeight}
                        className="w-52 xl:w-64 h-52 xl:h-64 object-contain transition-transform group-hover:scale-105"
                    />
                </div>
                <div className="grid justify-items-center gap-3">
                    <span className="text-center md:text-lg break-all font-medium">
                        {title}
                    </span>
                    <div className="grid content-end justify-items-center gap-2 h-full">
                        <span className="text-2xl md:text-3xl font-semibold">
                            {price}
                        </span>
                        <Button
                            theme={buttonTheme}
                            text={buttonText}
                            inline={buttonInline}
                            className={buttonClassName}
                        />
                    </div>
                </div>
            </Link>
            <Toaster />
        </div>
    );
}
