"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    deleteProductsFromCartAction,
    confirmAction,
} from "@/data/actions/cartActions";
import useGlobalStore from "@/stores/global";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

import Button from "@/components/ui/button/Button";

export default function SuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const search = searchParams.get("session_id");
    const setProductsInCartCount = useGlobalStore(
        (state) => state.setProductsInCartCount,
    );
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

            const confirmData = await confirmAction(search ?? "");

            if (confirmData && confirmData.isSuccess) {
                try {
                    await deleteProductsFromCartAction();
                } catch (e) {
                    console.error(e);
                    router.push("/");
                }

                setProductsInCartCount(0);
                setIsRefreshedPage(false);
            }

            if (!confirmData || (confirmData && !confirmData.isSuccess)) {
                router.push("/error");
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <main className="grid place-content-center container mx-auto mb-auto px-3 py-10 md:px-5">
            <section className="grid place-content-center justify-items-center gap-5 max-w-[500px] py-20">
                <div className="w-min p-5 bg-green-400 rounded-full shadow-md">
                    <IoMdCheckmarkCircleOutline className="text-7xl text-white" />
                </div>
                <h1 className="text-4xl font-bold text-gray-800">Success!</h1>
                <p className="text-lg text-center text-gray-600">
                    Your order has been successfully processed. Thank you for
                    your purchase!
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
