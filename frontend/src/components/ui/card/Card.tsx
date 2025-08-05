"use client";

import { memo, useEffect, useState } from "react";
import useWishlistStore from "@/stores/wishlist";
import useGlobalStore from "@/stores/global";
import Link from "next/link";
import { toast } from "sonner";
import {
    addProductToWishlistAction,
    deleteProductFromWishlistAction,
} from "@/data/actions/productActions";
import { getProductsInWishlistCount } from "@/data/loaders";
import { BiCommentDetail } from "react-icons/bi";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { FaStar } from "react-icons/fa";
import { CardProps } from "./Card.interfaces";

import Button from "@/components/ui/button/Button";
import StrapiImage from "../strapiImage/StrapiImage";

const Card = memo(function Card({
    productDocumentId,
    imageSrc,
    imageAlt,
    imageWidth,
    imageHeight,
    title,
    price,
    isDiscount,
    discountedPrice,
    averageRating,
    reviewsCount,
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
    const setProductsInWishlistCount = useGlobalStore(
        (state) => state.setProductsInWishlistCount,
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

    const showToast = (ok: boolean, message: string) => {
        const toastFn = ok ? toast.success : toast.error;
        const borderColor = ok ? "border-green-500" : "border-red-500";

        toastFn(message, {
            className: `text-xl border-l-8 ${borderColor}`,
        });
    };

    const handleAddProductToWishlist = async () => {
        const result = await addProductToWishlistAction(productDocumentId);

        if (result.ok) {
            setProductsInWishlist([...productsInWishlist, productDocumentId]);
            setWishlistDocumentId(result.wishlistDocumentId);

            const updatedProductsInWishlistCount =
                await getProductsInWishlistCount();

            setProductsInWishlistCount(updatedProductsInWishlistCount);
        }

        showToast(result.ok, result.message);
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

            const updatedProductsInWishlistCount =
                await getProductsInWishlistCount();

            setProductsInWishlistCount(updatedProductsInWishlistCount);
        }

        showToast(result.ok, result.message);
    };

    return (
        <div className="group relative grid justify-items-center gap-3 xl:min-h-[500px] p-3 md:p-8 bg-white border border-gray-200 rounded-3xl hover:shadow-lg cursor-pointer transition">
            <div className="absolute top-3 right-3 z-10">
                {productsInWishlist.includes(productDocumentId) ? (
                    <div
                        className="h-min p-3 bg-gray-100 hover:bg-gray-100/50 rounded-full transition hover:scale-105"
                        onClick={handleDeleteProductFromWishlist}
                    >
                        <GoHeartFill className="text-2xl md:text-3xl text-red-500" />
                    </div>
                ) : (
                    <div
                        className="h-min p-3 bg-gray-100/50 hover:bg-gray-100 rounded-full transition hover:scale-105"
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
                <div className="grid place-content-center">
                    <StrapiImage
                        src={imageSrc}
                        alt={imageAlt}
                        width={imageWidth}
                        height={imageHeight}
                        className="size-32 sm:size-48 xl:size-64 object-contain transition-transform group-hover:scale-105"
                    />
                </div>
                <div className="grid justify-items-center gap-1 md:gap-3">
                    <div className="grid place-content-between md:place-content-baseline">
                        <span className="text-center sm:text-lg font-medium">
                            {title}
                        </span>
                        <div className="flex justify-center items-center gap-1 sm:gap-2">
                            <div className="flex items-center gap-1">
                                <FaStar className="text-base md:text-2xl text-yellow-300" />
                                <span className="text-sm md:text-lg">
                                    {averageRating}
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <BiCommentDetail className="text-sm md:text-lg text-gray-600" />
                                <span className="text-sm md:text-lg text-gray-600">
                                    {reviewsCount}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="grid content-end justify-items-center gap-2 h-full">
                        {isDiscount && discountedPrice ? (
                            <div className="grid">
                                <span className="text-center text-sm md:text-lg text-gray-500 line-through font-semibold">
                                    ${price}
                                </span>
                                <span className="text-xl md:text-3xl font-semibold">
                                    ${discountedPrice}
                                </span>
                            </div>
                        ) : (
                            <span className="text-xl md:text-3xl font-semibold">
                                ${price}
                            </span>
                        )}
                        <Button
                            theme={buttonTheme}
                            text={buttonText}
                            inline={buttonInline}
                            className={buttonClassName}
                        />
                    </div>
                </div>
            </Link>
        </div>
    );
});

export default Card;
