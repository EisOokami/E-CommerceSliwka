import type { Metadata } from "next";
import BreadcrumbContainer from "@/components/layout/catalog/breadcrumbContainer/BreadcrumbContainer";

export const metadata: Metadata = {
    title: "E-Commerce Sliwka",
    description: "",
    icons: "/icon.ico",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="relative grid gap-10 py-6 md:py-10">
            <BreadcrumbContainer />
            {children}
        </main>
    );
}
