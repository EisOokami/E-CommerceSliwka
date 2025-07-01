"use client";

import { useEffect, useState, useTransition } from "react";
import useGlobalStore from "@/stores/global";
import useProductStore from "@/stores/product";
import toast from "react-hot-toast";
import {
    getCartProductData,
    getProductsInCartCount,
    getProductsInWishlistCount,
    getWishlistProductData,
} from "@/data/loaders";
import {
    addProductToCartAction,
    addProductToWishlistAction,
    deleteProductFromWishlistAction,
    deleteProductFromCartAction,
} from "@/data/actions/productActions";
import { ICart, IWishlist } from "@/interfaces/interfaces";
import { ActionsButtonProps } from "./ActionsButton.interfaces";

import Button from "@/components/ui/button/Button";

export default function ActionsButton({
    productData,
    wishlistData,
}: Readonly<ActionsButtonProps>) {
    const setProductsInCartCount = useGlobalStore(
        (state) => state.setProductsInCartCount,
    );
    const setProductsInWishlistCount = useGlobalStore(
        (state) => state.setProductsInWishlistCount,
    );
    const optionDocumentId = useProductStore((state) => state.optionDocumentId);
    const colorDocumentId = useProductStore((state) => state.colorDocumentId);
    const [isProductInCart, setIsProductInCart] = useState<boolean>(false);
    const [wishlist, setWishlist] = useState<IWishlist | undefined>(
        wishlistData,
    );
    const [isPendingWishlist, startTransitionWishlist] = useTransition();
    const [isPendingCart, startTransitionCart] = useTransition();

    useEffect(() => {
        (async () => {
            const updatedCartData: ICart = await getCartProductData(
                productData.documentId,
                optionDocumentId,
                colorDocumentId,
            );

            setIsProductInCart(updatedCartData ? true : false);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [colorDocumentId, optionDocumentId]);

    const showToast = (ok: boolean, message: string) => {
        const toastFn = ok ? toast.success : toast.error;
        const borderColor = ok ? "border-green-500" : "border-red-500";

        toastFn(message, {
            position: "bottom-right",
            className: `text-xl border-l-8 ${borderColor}`,
        });
    };

    const handleAddProductToCart = () => {
        startTransitionCart(async () => {
            const fetchResult = await addProductToCartAction(
                productData.documentId,
                optionDocumentId,
                colorDocumentId,
            );
            const updatedCart = await getCartProductData(
                productData.documentId,
                optionDocumentId,
                colorDocumentId,
            );
            const updatedProductsInCartCount = await getProductsInCartCount();

            showToast(fetchResult.ok, fetchResult.message);
            setIsProductInCart(updatedCart ? true : false);
            setProductsInCartCount(updatedProductsInCartCount);
        });
    };

    const handleDeleteProductFromCart = () => {
        if (!isProductInCart) {
            showToast(false, "Cart item not found.");

            return;
        }

        startTransitionCart(async () => {
            const fetchResult = await deleteProductFromCartAction(
                productData.documentId,
                optionDocumentId,
                colorDocumentId,
            );
            const updatedCart = await getCartProductData(
                productData.documentId,
                optionDocumentId,
                colorDocumentId,
            );
            const updatedProductsInCartCount = await getProductsInCartCount();

            showToast(fetchResult.ok, fetchResult.message);
            setIsProductInCart(updatedCart ? true : false);
            setProductsInCartCount(updatedProductsInCartCount);
        });
    };

    const handleAddProductToWishlist = () => {
        startTransitionWishlist(async () => {
            const fetchResult = await addProductToWishlistAction(
                productData.documentId,
            );
            const updatedWishlist = await getWishlistProductData(
                productData.documentId,
            );
            const updatedProductsInWishlistCount =
                await getProductsInWishlistCount();

            showToast(fetchResult.ok, fetchResult.message);
            setWishlist(updatedWishlist);
            setProductsInWishlistCount(updatedProductsInWishlistCount);
        });
    };

    const handleDeleteProductFromWishlist = () => {
        if (!wishlist) {
            showToast(false, "Wishlist item not found.");

            return;
        }

        startTransitionWishlist(async () => {
            const fetchResult = await deleteProductFromWishlistAction(
                wishlist.documentId,
            );
            const updatedWishlist = await getWishlistProductData(
                productData.documentId,
            );
            const updatedProductsInWishlistCount =
                await getProductsInWishlistCount();

            showToast(fetchResult.ok, fetchResult.message);
            setWishlist(updatedWishlist);
            setProductsInWishlistCount(updatedProductsInWishlistCount);
        });
    };

    return (
        <div className="grid lg:flex items-center gap-3 md:gap-5">
            {isPendingWishlist ? (
                <Button
                    theme="dark"
                    text="Loading"
                    inline
                    className="w-full text-center"
                    isLoading
                />
            ) : wishlist ? (
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
            {isPendingCart ? (
                <Button
                    theme="dark"
                    text="Loading"
                    className="w-full text-center"
                    isLoading
                />
            ) : isProductInCart ? (
                <Button
                    theme="dark"
                    text="Delete From Cart"
                    className="w-full text-center"
                    onClick={handleDeleteProductFromCart}
                />
            ) : (
                <Button
                    theme="dark"
                    text="Add to Cart"
                    className="w-full text-center"
                    onClick={handleAddProductToCart}
                />
            )}
        </div>
    );
}
