"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
    adminLoginService,
    mfaVerifyService,
} from "@/data/admin/services/services";
import { errorMessage } from "@/data/admin/services/client";
import {
    fieldClass,
    outlineButtonClass,
    solidButtonClass,
} from "@/constants/styles";

import AuthShell from "@/components/layout/main/authShell/AuthShell";
import { storeContent } from "@/constants/storeContent";
import { Field } from "@/components/ui/admin/apiState/ApiState";

export default function LoginPage() {
    const router = useRouter();
    const [step, setStep] = useState<"credentials" | "mfa">("credentials");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (busy) {
            return;
        }

        const form = event.currentTarget;
        const data = new FormData(form);

        setBusy(true);
        setError("");

        try {
            if (step === "credentials") {
                const result = await adminLoginService(
                    String(data.get("email")),
                    String(data.get("password")),
                );

                form.reset();

                if (result.mfaRequired) {
                    setStep("mfa");

                    return;
                }
            }

            if (step === "mfa") {
                await mfaVerifyService(String(data.get("code")));

                form.reset();
            }

            router.replace("/admin/dashboard");
        } catch (reason) {
            setError(errorMessage(reason));

            if (step === "mfa") {
                setStep("credentials");
                setError(
                    errorMessage(reason) +
                        " Please sign in again to request a new verification.",
                );
            }

            form.reset();
        } finally {
            setBusy(false);
        }
    };

    return (
        <main className="flex min-h-svh">
            <AuthShell pageData={storeContent.auth.signIn}>
                <div className="grid gap-2">
                    <h1 className="text-4xl md:text-5xl font-bold">
                        {step === "credentials"
                            ? "Admin sign in"
                            : "Two-factor verification"}
                    </h1>
                    <p className="text-sm text-gray-500">
                        {step === "credentials"
                            ? "Sign in to manage your store"
                            : "Enter a new 6-digit code from your authenticator app"}
                    </p>
                </div>
                <form key={step} onSubmit={submit} className="grid gap-6">
                    {step === "credentials" ? (
                        <>
                            <Field label="Email">
                                <input
                                    name="email"
                                    type="email"
                                    autoComplete="username"
                                    required
                                    maxLength={255}
                                    className={fieldClass}
                                    disabled={busy}
                                />
                            </Field>
                            <Field label="Password">
                                <input
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    maxLength={255}
                                    className={fieldClass}
                                    disabled={busy}
                                />
                            </Field>
                        </>
                    ) : (
                        <Field label="Authentication code">
                            <input
                                autoFocus
                                name="code"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                pattern="[0-9]{6}"
                                maxLength={6}
                                required
                                className={fieldClass}
                                disabled={busy}
                            />
                        </Field>
                    )}
                    {error && (
                        <p role="alert" className="text-sm text-red-600">
                            {error}
                        </p>
                    )}
                    <button
                        className={solidButtonClass + " w-full"}
                        disabled={busy}
                    >
                        {busy
                            ? "Please wait..."
                            : step === "credentials"
                              ? "Sign in"
                              : "Verify"}
                    </button>
                    {step === "mfa" && (
                        <button
                            type="button"
                            className={outlineButtonClass + " w-full"}
                            disabled={busy}
                            onClick={() => {
                                setStep("credentials");
                                setError("");
                            }}
                        >
                            Back to sign in
                        </button>
                    )}
                </form>
            </AuthShell>
        </main>
    );
}
