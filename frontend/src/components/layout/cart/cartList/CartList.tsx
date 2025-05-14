"use client";

import { useState } from "react";
import Image from "next/image";
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
            {(!cartItemsData.length ||
                deletedProducts.length === cartItemsData.length) && (
                <div className="grid place-items-center gap-2 w-full mt-5">
                    <Image
                        src="/no-data.svg"
                        alt="no-data"
                        width={300}
                        height={300}
                    />
                    <h1 className="text-center text-5xl text-gray-500 font-medium">
                        Sorry... <br />
                        no result found
                    </h1>
                </div>
            )}
        </div>
    );
}
