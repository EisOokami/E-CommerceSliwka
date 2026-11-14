import {
    getGlobalData,
    getProductsInCartCount,
    getProductsInWishlistCount,
} from "@/data/main/loaders";
import { getUserMeLoader } from "@/data/main/services/getUserMeLoader";

import CustomerSession from "@/components/layout/main/customerSession/CustomerSession";
import Footer from "@/components/layout/main/footer/Footer";
import Header from "@/components/layout/main/header/Header";

export default async function StoreLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const [global, user, cartCount, wishlistCount] = await Promise.all([
        getGlobalData(),
        getUserMeLoader(),
        getProductsInCartCount(),
        getProductsInWishlistCount(),
    ]);

    return (
        <div className="min-h-svh flex flex-col">
            <CustomerSession
                id={user.data?.id ?? null}
                cartCount={cartCount}
                wishlistCount={wishlistCount}
            />
            <Header
                data={global.data.header}
                isUserSingIn={user.ok}
                globalProductsInCartCount={cartCount}
                globalProductsInWishlistCount={wishlistCount}
            />
            {children}
            <Footer data={global.data.footer} />
        </div>
    );
}
