"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserMeLoader } from "@/data/services/getUserMeLoader";
import useGlobalStore from "@/stores/global";
import { MdOutlineCancel } from "react-icons/md";

import Button from "@/components/ui/button/Button";

export default function CancelPage() {
    const [isUser, setIsUser] = useState<boolean | null>(null);
    const router = useRouter();
    const [isConfirm, setIsConfirm] = useState<boolean>(false);
    const isRefreshedPage = useGlobalStore((state) => state.isRefreshedPage);
    const setIsRefreshedPage = useGlobalStore(
        (state) => state.setIsRefreshedPage,
    );

    useEffect(() => {
        (async () => {
            const userData = await getUserMeLoader();

            setIsUser(userData.ok);
        })();
    }, []);

    useEffect(() => {
        if (isUser === false) {
            router.push("/");
        }
    }, [isUser, router]);

    useEffect(() => {
        (async () => {
            if (!isRefreshedPage && !isUser) {
                setIsRefreshedPage(true);

                router.refresh();
            }

            if (isRefreshedPage) {
                setIsConfirm(true);
            }
        })();
    }, [isRefreshedPage, isUser, router, setIsRefreshedPage]);

    if (!isConfirm) {
        return (
            <main>
                <div className="grid place-content-center h-svh">
                    <div className="animate-spin h-12 w-12 border-t-4 border-pink-600 rounded-full" />
                </div>
            </main>
        );
    }

    if (isUser === null) return null;

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
