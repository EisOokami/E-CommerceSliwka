"use client";

import { useEffect } from "react";
import { MdOutlineCancel } from "react-icons/md";

import Button from "@/components/ui/button/Button";
import useGlobalStore from "@/stores/global";
import { useRouter } from "next/navigation";

export default function CancelPage() {
    const router = useRouter();
    const isRefreshedPage = useGlobalStore((state) => state.isRefreshedPage);
    const setIsRefreshedPage = useGlobalStore(
        (state) => state.setIsRefreshedPage,
    );

    useEffect(() => {
        (async () => {
            if (!isRefreshedPage) {
                setIsRefreshedPage(true);
                router.refresh();
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <main className="grid place-content-center container mx-auto mb-auto px-3 py-10 md:px-5">
            <section className="grid place-content-center justify-items-center gap-5 max-w-[500px] py-20">
                <div className="w-min p-5 bg-red-400 rounded-full shadow-md">
                    <MdOutlineCancel className="text-7xl text-white" />
                </div>
                <h1 className="text-4xl font-bold text-gray-800">
                    Order Cancelled
                </h1>
                <p className="text-lg text-center text-gray-600">
                    Your order has been cancelled successfully. No charges have
                    been made to your account. Feel free to continue shopping
                    when you&apos;re ready.
                </p>
                <div className="flex gap-5">
                    <Button href="/cart" text="View Cart" theme="dark" isLink />
                    <Button
                        href="/"
                        text="Go Home"
                        theme="dark"
                        inline
                        isLink
                    />
                </div>
            </section>
        </main>
    );
}
