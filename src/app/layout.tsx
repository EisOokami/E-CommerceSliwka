import type { Metadata } from "next";
import "./globals.scss";
import Navbar from "@/components/layout/home/navbar/Navbar";
import Footer from "@/components/layout/home/footer/Footer";

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
        <html lang="en">
            <body>
                <Navbar />
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    );
}
