import { Suspense } from "react";
import {
    getGlobalData,
    getProductsInCartCount,
    getProductsInWishlistCount,
} from "@/data/main/loaders";
import { getUserMeLoader } from "@/data/main/services/getUserMeLoader";

import AccountDeletedNotice from "@/components/layout/main/accountDeletedNotice/AccountDeletedNotice";
import CustomerSession from "@/components/layout/main/customerSession/CustomerSession";
import DemoBanner from "@/components/layout/main/demoBanner/DemoBanner";
import Footer from "@/components/layout/main/footer/Footer";
import Header from "@/components/layout/main/header/Header";
import TermsUpdateDialog from "@/components/layout/main/termsUpdateDialog/TermsUpdateDialog";

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
            <Suspense>
                <AccountDeletedNotice />
            </Suspense>
            {user.data?.requiresTermsAcceptance && <TermsUpdateDialog />}
            <DemoBanner />
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
