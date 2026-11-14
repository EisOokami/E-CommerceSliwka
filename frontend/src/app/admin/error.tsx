"use client";

export default function AdminError({
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <section className="p-8" role="alert">
            <h1 className="font-semibold">Unable to load the admin panel</h1>
            <p className="mt-2">Please try again.</p>
            <button className="mt-4 underline" onClick={reset}>
                Retry
            </button>
        </section>
    );
}
