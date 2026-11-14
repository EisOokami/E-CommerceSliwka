"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export function useServerData<T>(data: T) {
    const [loading, startTransition] = useTransition();
    const router = useRouter();

    return {
        data,
        loading,
        error: "",
        reload: () => {
            return startTransition(() => {
                return router.refresh();
            });
        },
    };
}
