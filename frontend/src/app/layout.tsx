import type { Metadata } from "next";
import {
    getGlobalData,
    getGlobalPageMetadata,
    getProductsInCartCount,
    getProductsInWishlistCount,
} from "@/data/loaders";
import { getUserMeLoader } from "@/data/services/getUserMeLoader";
import "./globals.scss";
import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/footer/Footer";

export async function generateMetadata(): Promise<Metadata> {
    const metadata = await getGlobalPageMetadata();

    return {
        title: metadata?.data?.title ?? "E-Commerce Sliwka",
        description:
            metadata?.data?.description ??
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

    if (globalData.message || (user.data && user.data.message)) {
        return (
            <html lang="en">
                <body className="flex flex-col">
                    <main className="grid justify-items-center content-center mb-auto py-10 md:py-20 text-center">
                        <h3 className="font-bold text-xl md:text-4xl">
                            Oops! Something went wrong.
                        </h3>
                        <h3 className="font-bold text-xl md:text-4xl">
                            This is an error page. Please try again later.
                        </h3>
                        <h1 className="text-[200px] md:text-[300px] xl:text-[400px] font-bold text-gray-300">
                            404
                        </h1>
                        <p>
                            {globalData.message
                                ? globalData.message
                                : user.data.message}
                        </p>
                    </main>
                </body>
            </html>
        );
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
            </body>
        </html>
    );
}
