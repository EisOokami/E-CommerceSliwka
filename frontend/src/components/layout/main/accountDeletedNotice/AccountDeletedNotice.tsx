"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function AccountDeletedNotice() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const deleted = searchParams.get("accountDeleted") === "1";

    useEffect(() => {
        if (!deleted) {
            return;
        }

        toast.success("Your account and data have been deleted.");
        router.replace(pathname, { scroll: false });
    }, [deleted, pathname, router]);

    return null;
}
