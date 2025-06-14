import type { Metadata } from "next";
import { getGlobalData, getGlobalPageMetadata } from "@/data/loaders";
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
            "lakiolive",
            "lakio",
            "fast delivery",
        ],
        authors: [{ name: "LakioLive", url: "https://github.com/LakioLive" }],
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

    return (
        <html lang="en">
            <body className="h-svh flex flex-col">
                <Header data={globalData.data.header} isUserSingIn={user.ok} />
                {children}
                <Footer data={globalData.data.footer} />
            </body>
        </html>
    );
}
