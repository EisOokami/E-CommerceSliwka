import type { Metadata } from "next";
import {
    getGlobalData,
    getGlobalPageMetadata,
    getProductsInCartCount,
    getProductsInWishlistCount,
} from "@/data/loaders";
import { getUserMeLoader } from "@/data/services/getUserMeLoader";
import { Toaster } from "sonner";
import "sonner/dist/styles.css";
import "./globals.scss";

import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/footer/Footer";
import ErrorPage from "@/components/layout/errorPage/ErrorPage";

export async function generateMetadata(): Promise<Metadata> {
    const metadata = await getGlobalPageMetadata();

    return {
        title: metadata.data.title ?? "E-Commerce Sliwka",
        description:
            metadata.data.description ??
            "Buy the latest products at great prices. Fast delivery only from us!",
        icons: "/icon.ico",
        keywords: [
            "gadgets",
            "smartphones",
            "laptops",
            "accessories",
            "buy online",
            "nextjs",
            "e-commerce",
            "e-commerce sliwka",
            "fast delivery",
        ],
        authors: [{ name: "EisOokami", url: "https://github.com/EisOokami" }],
        robots: "index, follow",
        other: {
            "application/ld+json": JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "E-Commerce Sliwka",
                //   "url": "https://example.com",
                //   "logo": "https://example.com/logo.png",
            }),
        },
    };
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const globalData = await getGlobalData();
    const user = await getUserMeLoader();
    const productsInCartCount = await getProductsInCartCount();
    const productsInWishlistCount = await getProductsInWishlistCount();

    const userError = user?.data?.message;

    if ("message" in globalData) {
        return <ErrorPage message={globalData.message.error.message} />;
    }

    if (userError) {
        return <ErrorPage message={userError} />;
    }

    return (
        <html lang="en">
            <body className="min-h-svh flex flex-col">
                <Header
                    data={globalData.data.header}
                    isUserSingIn={user.ok}
                    globalProductsInCartCount={productsInCartCount}
                    globalProductsInWishlistCount={productsInWishlistCount}
                />
                {children}
                <Footer data={globalData.data.footer} />
                <Toaster
                    position="bottom-right"
                    closeButton
                    richColors
                    toastOptions={{
                        classNames: {
                            title: "!text-lg md:!text-xl",
                            icon: "!w-6 !h-6",
                            closeButton: "!w-7 md:!w-6 !h-7 md:!h-6",
                        },
                    }}
                />
            </body>
        </html>
    );
}
