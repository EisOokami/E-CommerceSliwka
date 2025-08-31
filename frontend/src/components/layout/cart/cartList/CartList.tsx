"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import useCartStore from "@/stores/cart";
import { TbShoppingCartX } from "react-icons/tb";
import { CartListProps } from "./CartList.interfaces";

import CartItemSkeleton from "@/components/ui/cartItem/CartItemSkeleton";
const CartItem = dynamic(() => import("@/components/ui/cartItem/CartItem"), {
    ssr: false,
    loading: () => <CartItemSkeleton />,
});

export default function CartList({ cartItemsData }: Readonly<CartListProps>) {
    const deletedProducts = useCartStore((state) => state.deletedProducts);
    const setIsCheckoutBlocked = useCartStore(
        (state) => state.setIsCheckoutBlocked,
    );

    useEffect(() => {
        cartItemsData.some((cartItem) => {
            if (
                (!cartItem.product.quantity || !cartItem.product.inStock) &&
                !deletedProducts.includes(cartItem.documentId)
            ) {
                setIsCheckoutBlocked(true);

                return true;
            }

            setIsCheckoutBlocked(false);
        });
    }, [cartItemsData, deletedProducts, setIsCheckoutBlocked]);

    return (
        <div className="grid w-full md:w-1/2">
            {(() => {
                const visibleCartItems = cartItemsData.filter(
                    (item) => !deletedProducts.includes(item.documentId),
                );

                return visibleCartItems.length > 0 ? (
                    visibleCartItems.map((cartItem) => (
                        <CartItem
                            key={cartItem.documentId}
                            cartItem={cartItem}
                        />
                    ))
                ) : (
                    <div className="grid place-content-center gap-2 w-full my-10 md:my-0 md:mt-5">
                        <div className="flex justify-center">
                            <TbShoppingCartX className="text-8xl text-gray-300" />
                        </div>
                        <h1 className="text-center text-3xl text-gray-800 font-medium">
                            No products found
                        </h1>
                        <p className="text-center text-2xl text-gray-500">
                            Try add product
                        </p>
                    </div>
                );
            })()}
        </div>
    );
}
