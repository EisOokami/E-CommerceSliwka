"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { acceptTermsAction } from "@/data/main/actions/legalActions";
import { logoutAction } from "@/data/main/actions/authActions";

import Button from "@/components/ui/main/button/Button";

export default function TermsUpdateDialog() {
    const [open, setOpen] = useState(true);
    const [accepted, setAccepted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pending, startTransition] = useTransition();
    const router = useRouter();

    if (!open) {
        return null;
    }

    const handleAccept = () => {
        startTransition(async () => {
            const result = await acceptTermsAction();

            if (!result.ok) {
                setError(result.message);

                return;
            }

            setOpen(false);

            router.refresh();
        });
    };

    const handleSignOut = () => {
        startTransition(async () => {
            await logoutAction();

            router.push("/");
            router.refresh();
        });
    };

    return (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/50 p-4">
            <div className="grid gap-5 w-full max-w-md p-6 bg-white rounded-xl shadow-xl">
                <h2 id="terms-update-title" className="text-2xl font-bold">
                    Updated Terms and Privacy Policy
                </h2>
                <p className="text-gray-600">
                    We have published new versions of the Terms of Service and
                    the Privacy Policy. Please review them and accept to
                    continue using the store.
                </p>
                <div className="flex gap-2">
                    <input
                        type="checkbox"
                        id="accept-updated-terms"
                        checked={accepted}
                        onChange={(event) => setAccepted(event.target.checked)}
                        disabled={pending}
                    />
                    <label htmlFor="accept-updated-terms">
                        I accept the updated{" "}
                        <Link
                            href="/terms"
                            target="_blank"
                            className="underline"
                        >
                            Terms of Service
                        </Link>{" "}
                        and confirm that I have read the updated{" "}
                        <Link
                            href="/privacy"
                            target="_blank"
                            className="underline"
                        >
                            Privacy Policy
                        </Link>
                    </label>
                </div>
                {error && <p className="text-red-600">{error}</p>}
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                    <Button
                        text="Sign out"
                        theme="dark"
                        inline
                        onClick={handleSignOut}
                        className="sm:px-6"
                    />
                    <button
                        type="button"
                        onClick={handleAccept}
                        disabled={!accepted || pending}
                        className="px-6 py-3 rounded-lg text-white bg-black hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        {pending ? "Saving..." : "Accept and continue"}
                    </button>
                </div>
            </div>
        </div>
    );
}
