"use client";

import { useState } from "react";
import { CartListProps } from "./CartList.interfaces";

import CartItem from "@/components/ui/сartItem/CartItem";

export default function CartList({ cartItemsData }: Readonly<CartListProps>) {
    const [deletedProducts, setDeletedProducts] = useState<string[]>([]);

    return (
        <div className="grid w-full md:w-1/2">
            {cartItemsData.map((cartItem, i) =>
                !deletedProducts.includes(cartItem.documentId) ? (
                    <CartItem
                        key={i}
                        cartItem={cartItem}
                        setDeletedProducts={setDeletedProducts}
                    />
                ) : null,
            )}
        </div>
    );
}
