"use client";

import dynamic from "next/dynamic";
import useWishlistStore from "@/stores/wishlist";
import { GoHeart } from "react-icons/go";
import { WishlistProps } from "./Wishlist.interfaces";

import WishlistItemSkeleton from "@/components/ui/main/wishlistItem/WishlistItemSkeleton";

const WishlistItem = dynamic(
    () => import("@/components/ui/main/wishlistItem/WishlistItem"),
    { ssr: false, loading: () => <WishlistItemSkeleton /> },
);

export default function Wishlist({ wishlistData }: Readonly<WishlistProps>) {
    const deletedProducts = useWishlistStore((state) => state.deletedProducts);

    return (
        <section className="grid gap-10 py-5">
            {(() => {
                const visibleWishlist = wishlistData.filter(
                    (item) => !deletedProducts.includes(item.id),
                );

                return visibleWishlist.length > 0 ? (
                    visibleWishlist.map((wishlist) => (
                        <WishlistItem key={wishlist.id} wishlist={wishlist} />
                    ))
                ) : (
                    <div className="grid place-items-center gap-2 w-full mt-5">
                        <div className="flex justify-center">
                            <GoHeart className="text-8xl text-gray-300" />
                        </div>
                        <h1 className="text-center text-3xl text-gray-800 font-medium">
                            No products found
                        </h1>
                        <p className="text-center text-2xl text-gray-500">
                            Try add favorite product
                        </p>
                    </div>
                );
            })()}
        </section>
    );
}
