import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/breadcrumb/Breadcrumb";

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
            <section className="container mx-auto px-3 md:px-5">
                <Breadcrumb />
            </section>
            {children}
        </main>
    );
}
