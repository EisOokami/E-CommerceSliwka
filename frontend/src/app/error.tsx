"use client";

import ErrorPage from "@/components/layout/main/errorPage/ErrorPage";

export default function Error({
    reset,
}: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
    return (
        <ErrorPage
            message="We couldn't load this page. Please try again."
            onRetry={reset}
        />
    );
}
