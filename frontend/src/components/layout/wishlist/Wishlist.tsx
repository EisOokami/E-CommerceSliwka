"use client";

import { useState } from "react";
import { WishlistProps } from "./Wishlist.interfaces";

import WishlistItem from "@/components/ui/wishlistItem/WishlistItem";

export default function Wishlist({ wishlistData }: WishlistProps) {
    const [removedProducts, setRemovedProducts] = useState<string[]>([]);

    return (
        <div className="grid gap-10 py-5">
            {wishlistData.map((wishlist) =>
                !removedProducts.includes(wishlist.documentId) ? (
                    <WishlistItem
                        key={wishlist.documentId}
                        wishlist={wishlist}
                        setRemovedProducts={setRemovedProducts}
                    />
                ) : null,
            )}
        </div>
    );
}
