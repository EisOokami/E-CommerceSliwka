"use client";

import { useSearchParams, useRouter } from "next/navigation";
import useGlobalStore from "@/stores/global";

import Loading from "../loading";

export default function RedirectPage() {
    const isRefreshedPage = useGlobalStore((state) => state.isRefreshedPage);
    const setIsRefreshedPage = useGlobalStore(
        (state) => state.setIsRefreshedPage,
    );
    const searchParams = useSearchParams();
    const router = useRouter();

    if (!isRefreshedPage) {
        setIsRefreshedPage(true);

        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    router.push(searchParams.get("path") ?? "");

    return <Loading />;
}
