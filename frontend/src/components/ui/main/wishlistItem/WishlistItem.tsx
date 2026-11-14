"use client";

import { MouseEvent, useRef, useState } from "react";
import useGlobalStore from "@/stores/global";
import useWishlistStore from "@/stores/wishlist";
import Link from "next/link";
import { toast } from "sonner";
import { getProductsInWishlistCount } from "@/data/main/loaders";
import { deleteProductFromWishlistAction } from "@/data/main/actions/productActions";
import { FaRegTrashCan } from "react-icons/fa6";
import { WishlistItemProps } from "./WishlistItem.interfaces";

import RatingStars from "../ratingStars/RatingStars";
import Button from "../button/Button";
import AppImage from "../appImage/AppImage";

export default function WishlistItem({
    wishlist,
}: Readonly<WishlistItemProps>) {
    const setProductsInWishlistCount = useGlobalStore(
        (state) => state.setProductsInWishlistCount,
    );
    const productsInWishlist = useWishlistStore(
        (state) => state.productsInWishlist,
    );
    const setProductsInWishlist = useWishlistStore(
        (state) => state.setProductsInWishlist,
    );
    const deletedProducts = useWishlistStore((state) => state.deletedProducts);
    const setDeletedProducts = useWishlistStore(
        (state) => state.setDeletedProducts,
    );
    const [isVisible, setIsVisible] = useState<boolean>(true);

    const busy = useRef(false);
    const handleDeleteProductFromWishlist = async () => {
        if (busy.current) {
            return;
        }

        busy.current = true;

        try {
            const result = await deleteProductFromWishlistAction(wishlist.id);

            if (!result.ok) {
                toast.error(result.message);

                return;
            }

            setIsVisible(false);

            setTimeout(
                () => setDeletedProducts([...deletedProducts, wishlist.id]),
                300,
            );

            setProductsInWishlist(
                productsInWishlist.filter(
                    (productInWishlist) =>
                        wishlist.product.id !== productInWishlist,
                ),
            );

            const updatedProductsInWishlistCount =
                await getProductsInWishlistCount();

            setProductsInWishlistCount(updatedProductsInWishlistCount);
        } catch {
            toast.error("Wishlist could not be updated. Please reload.");
        } finally {
            busy.current = false;
        }
    };

    const handleDisableRedirect = (
        e: MouseEvent<HTMLDivElement | HTMLButtonElement>,
    ) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <Link
            href={`/catalog/${wishlist.product.slug}`}
            className={`transition-all duration-300 ease-out ${
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
        >
            <div className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
                <div className="md:flex">
                    <div className="flex justify-center md:w-1/4 h-48 md:h-auto">
                        <AppImage
                            src={wishlist.product.image.url}
                            alt={wishlist.product.name}
                            width={500}
                            height={500}
                            className="w-60 object-contain"
                        />
                    </div>
                    <div className="p-4 md:p-6 md:w-3/4 flex flex-col">
                        <div className="block flex-1">
                            <h3 className="text-xl font-medium text-gray-900 mb-1 hover:text-blue-600 transition-colors">
                                {wishlist.product.name}
                            </h3>
                            <p className="text-sm text-gray-500 mb-3">
                                {wishlist.product.category.category}
                            </p>
                            <div className="flex items-center mb-2">
                                <RatingStars
                                    count={wishlist.product.averageRating}
                                />
                                <span className="text-sm text-gray-500 ml-1">
                                    ({wishlist.product.averageRating.toFixed(1)}
                                    )
                                </span>
                            </div>
                            <p className="text-gray-700 text-sm line-clamp-2 mb-3">
                                {wishlist.product.description}
                            </p>
                        </div>
                        <div className="grid md:flex items-center justify-between gap-3 md:gap-0 mt-4 pt-4 border-t border-gray-100">
                            <div className="text-xl font-bold text-gray-900">
                                ${wishlist.product.price.toFixed(2)}
                            </div>
                            <div className="flex flex-row-reverse md:flex-row items-center gap-2 md:gap-0 md:space-x-2">
                                <button
                                    onClick={(e) => {
                                        handleDisableRedirect(e);
                                        handleDeleteProductFromWishlist();
                                    }}
                                    className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                                >
                                    <FaRegTrashCan className="text-xl" />
                                </button>
                                <Button
                                    theme="dark"
                                    text="Buy now"
                                    className="w-max"
                                    tabIndex={-1}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
