import { getWishlistProductsData } from "@/data/loaders";
import { GoHeart } from "react-icons/go";
import { IWishlist } from "@/interfaces/interfaces";

import Wishlist from "@/components/layout/wishlist/Wishlist";

export default async function WishlistPage() {
    const data: IWishlist[] = await getWishlistProductsData();

    return (
        <main className="container mx-auto mb-auto px-3 py-10 md:px-5">
            <section className="flex items-center gap-1">
                <GoHeart className="md:mt-1 text-3xl text-red-500" />
                <h1 className="text-2xl md:text-3xl xl:text-4xl font-medium">
                    My Wishlist
                </h1>
            </section>
            <Wishlist wishlistData={data} />
        </main>
    );
}
