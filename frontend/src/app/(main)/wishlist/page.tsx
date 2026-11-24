import { redirect } from "next/navigation";
import { getWishlistProductsData } from "@/data/main/loaders";
import { getUserMeLoader } from "@/data/main/services/getUserMeLoader";
import { GoHeart } from "react-icons/go";

import Wishlist from "@/components/layout/main/wishlist/Wishlist";
import RefreshOnFocus from "@/components/layout/main/refreshOnFocus/RefreshOnFocus";

export default async function WishlistPage() {
    const user = await getUserMeLoader();
    const data = await getWishlistProductsData();

    if (!user.ok) {
        redirect("/signIn");
    }

    return (
        <main className="container mx-auto mb-auto px-3 py-10 md:px-5">
            <section className="flex items-center gap-1">
                <GoHeart className="md:mt-1 text-3xl text-red-500" />
                <h1 className="text-2xl md:text-3xl xl:text-4xl font-medium">
                    My Wishlist
                </h1>
            </section>
            <RefreshOnFocus />
            <Wishlist wishlistData={data} />
        </main>
    );
}
