import type { Metadata } from "next";

import Sidebar from "@/components/layout/account/sidebar/Sidebar";

export const metadata: Metadata = {
    title: "E-Commerce Sliwka",
    description: "",
    icons: "/icon.ico",
};

export default function AccountLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="grid md:flex gap-10 container mx-auto mb-auto px-3 py-10 md:px-5">
            <Sidebar />
            {children}
        </div>
    );
}
