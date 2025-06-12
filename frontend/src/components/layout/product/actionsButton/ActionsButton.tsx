"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { getWishlistProductData } from "@/data/loaders";
import {
    addProductToCartAction,
    addProductToWishlistAction,
    deleteProductFromWishlistAction,
} from "@/data/actions/productActions";
import { IWishlist } from "@/interfaces/interfaces";
import { ActionsButtonProps } from "./ActionsButton.interfaces";

import Button from "@/components/ui/button/Button";

export default function ActionsButton({
    strapiData,
    wishlistData,
}: Readonly<ActionsButtonProps>) {
    const [wishlist, setWishlist] = useState<IWishlist | undefined>(
        wishlistData,
    );

    const showToast = (ok: boolean, message: string) => {
        const toastFn = ok ? toast.success : toast.error;
        const borderColor = ok ? "border-green-500" : "border-red-500";

        toastFn(message, {
            position: "bottom-right",
            className: `text-xl border-l-8 ${borderColor}`,
        });
    };

    const handleAddProductToCart = async () => {
        const fetchResult = await addProductToCartAction(strapiData.documentId);

        showToast(fetchResult.ok, fetchResult.message);
    };

    const handleAddProductToWishlist = async () => {
        const fetchResult = await addProductToWishlistAction(
            strapiData.documentId,
        );

        const updatedWishlist = await getWishlistProductData(
            strapiData.documentId,
        );

        showToast(fetchResult.ok, fetchResult.message);
        setWishlist(updatedWishlist);
    };

    const handleDeleteProductFromWishlist = async () => {
        if (!wishlist) {
            showToast(false, "Wishlist item not found.");

            return;
        }

        const fetchResult = await deleteProductFromWishlistAction(
            wishlist.documentId,
        );

        const updatedWishlist = await getWishlistProductData(
            strapiData.documentId,
        );

        showToast(fetchResult.ok, fetchResult.message);
        setWishlist(updatedWishlist);
    };

    return (
        <div className="grid lg:flex items-center gap-3 md:gap-5">
            {wishlist ? (
                <Button
                    theme="dark"
                    text="Delete from Wishlist"
                    inline
                    className="w-full text-center"
                    onClick={handleDeleteProductFromWishlist}
                />
            ) : (
                <Button
                    theme="dark"
                    text="Add to Wishlist"
                    inline
                    className="w-full text-center"
                    onClick={handleAddProductToWishlist}
                />
            )}
            <Button
                theme="dark"
                text="Add to Cart"
                className="w-full text-center"
                onClick={handleAddProductToCart}
            />
        </div>
    );
}
