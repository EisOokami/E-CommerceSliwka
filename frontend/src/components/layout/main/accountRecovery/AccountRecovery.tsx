"use client";

import { useActionState } from "react";
import Link from "next/link";
import AuthShell from "@/components/layout/main/authShell/AuthShell";
import { storeContent } from "@/constants/storeContent";
import AccountInput from "@/components/ui/main/accountInput/AccountInput";
import Button from "@/components/ui/main/button/Button";
import { recoverAccount } from "@/data/main/actions/accountRecoveryActions";
import { AccountRecoveryProps } from "./AccountRecovery.interfaces";

export default function AccountRecovery({
    mode,
    token = "",
    id = "",
}: Readonly<AccountRecoveryProps>) {
    const [state, action, pending] = useActionState(
        recoverAccount.bind(null, mode, token, id),
        { ok: false, message: null },
    );

    const title = {
        verify: "Verify email",
        resend: "Resend verification email",
        forgot: "Forgot password",
        reset: "Reset password",
    }[mode];

    return (
        <AuthShell pageData={storeContent.auth.signIn}>
            <h1 className="text-4xl md:text-5xl font-bold">{title}</h1>
            <form action={action} className="grid gap-6">
                {(mode === "forgot" || mode === "resend") && (
                    <AccountInput
                        zodErrorMsg={undefined}
                        id="email"
                        name="email"
                        type="email"
                        labelValue="Email"
                    />
                )}
                {mode === "reset" && (
                    <>
                        <AccountInput
                            zodErrorMsg={undefined}
                            id="password"
                            name="password"
                            type="password"
                            labelValue="New password"
                        />
                        <AccountInput
                            zodErrorMsg={undefined}
                            id="confirmation"
                            name="confirmation"
                            type="password"
                            labelValue="Confirm new password"
                        />
                    </>
                )}
                {state.message && (
                    <p role={state.ok ? "status" : "alert"}>{state.message}</p>
                )}
                {!state.ok && (
                    <Button
                        type="submit"
                        theme="dark"
                        text={pending ? "Please wait..." : title}
                        isLoading={pending}
                        className="w-full"
                    />
                )}
            </form>
            <Link href="/signIn" className="underline">
                Back to sign in
            </Link>
            {mode === "verify" && (
                <Link href="/verifyEmail" className="underline">
                    Request a new verification link
                </Link>
            )}
        </AuthShell>
    );
}
