"use client";

import Image from "next/image";
import Link from "next/link";
import { FaRegTrashCan } from "react-icons/fa6";
import { deleteProductFromWishlistAction } from "@/data/actions/productActions";

import { WishlistItemProps } from "./WishlistItem.interfaces";
import RatingStars from "../ratingStars/RatingStars";
import Button from "../button/Button";

export default function WishlistItem({
    wishlist,
    setRemovedProducts,
}: WishlistItemProps) {
    const handleDeleteProductFromWishlist = () => {
        setRemovedProducts((prevState) => [...prevState, wishlist.documentId]);
        deleteProductFromWishlistAction(wishlist.documentId);
    };

    return (
        <div className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
            <div className="md:flex">
                <div className="flex justify-center md:w-1/4 h-48 md:h-auto">
                    <Image
                        src={`${process.env.NEXT_PUBLIC_DB_URL}${wishlist.product.image.url}`}
                        alt={wishlist.product.name}
                        width={500}
                        height={500}
                        className="w-60 object-contain"
                    />
                </div>
                <div className="p-4 md:p-6 md:w-3/4 flex flex-col">
                    <div className="flex-1">
                        <Link
                            href={`/catalog/${wishlist.product.slug}`}
                            className="block"
                        >
                            <h3 className="text-xl font-medium text-gray-900 mb-1 hover:text-blue-600 transition-colors">
                                {wishlist.product.name}
                            </h3>
                        </Link>
                        <p className="text-sm text-gray-500 mb-3">
                            {wishlist.product.category.category}
                        </p>
                        <div className="flex items-center mb-2">
                            <RatingStars
                                count={wishlist.product.averageRating}
                            />
                            <span className="text-sm text-gray-500 ml-1">
                                ({wishlist.product.averageRating.toFixed(1)})
                            </span>
                        </div>
                        <p className="text-gray-700 text-sm line-clamp-2 mb-3">
                            {wishlist.product.description}
                        </p>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <div className="text-xl font-bold text-gray-900">
                            ${wishlist.product.price.toFixed(2)}
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={handleDeleteProductFromWishlist}
                                className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                            >
                                <FaRegTrashCan className="text-xl" />
                            </button>
                            <Button
                                href={`/catalog/${wishlist.product.slug}`}
                                isLink
                                theme="dark"
                                text="Buy now"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
