import type { Metadata } from "next";
import { Toaster } from "sonner";
import "sonner/dist/styles.css";
import "./globals.scss";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "E-Commerce Sliwka",
    description:
        "Buy the latest products at great prices. Fast delivery only from us!",
    icons: "/icon.ico",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="min-h-svh flex flex-col">
                {children}
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
