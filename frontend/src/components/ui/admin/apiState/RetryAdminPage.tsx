"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function RetryAdminPage() {
    const router = useRouter();
    const [pending, startTransition] = useTransition();

    return (
        <button
            className="mt-4 underline"
            disabled={pending}
            onClick={() => startTransition(() => router.refresh())}
        >
            {pending ? "Retrying..." : "Retry"}
        </button>
    );
}
