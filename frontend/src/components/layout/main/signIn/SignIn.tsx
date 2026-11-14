"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginUserAction } from "@/data/main/actions/authActions";
import { SignInProps } from "./SignIn.interfaces";

import Button from "@/components/ui/main/button/Button";
import { StrapiErrors } from "@/components/ui/main/strapiErrors/StrapiErrors";
import AuthShell from "@/components/layout/main/authShell/AuthShell";
import AuthInput from "@/components/ui/main/authInput/AuthInput";

const INITIAL_STATE = {
    zodErrors: null,
    strapiErrors: null,
    message: null,
    strapiErrorsDetails: null,
    formData: null,
};

export default function SignIn({ pageData }: Readonly<SignInProps>) {
    const [formState, formAction, pending] = useActionState(
        loginUserAction,
        INITIAL_STATE,
    );

    return (
        <AuthShell pageData={pageData}>
            <form action={formAction} className="grid gap-6" noValidate>
                <div className="grid gap-1">
                    <h2 className="text-5xl font-bold">Sign In</h2>
                    <p className="text-gray-500">
                        Enter your details to sign in to your account
                    </p>
                </div>
                {!formState?.requiresMfa && (
                    <>
                        <AuthInput
                            id="email"
                            name="email"
                            type="email"
                            labelValue="Email"
                            zodErrorMsg={formState?.zodErrors?.identifier}
                            defaultValue={
                                formState?.formData?.get("email")?.toString() ??
                                undefined
                            }
                        />
                        <AuthInput
                            id="password"
                            name="password"
                            type="password"
                            labelValue="Password"
                            zodErrorMsg={formState?.zodErrors?.password}
                            defaultValue={
                                formState?.formData
                                    ?.get("password")
                                    ?.toString() ?? undefined
                            }
                        />
                    </>
                )}
                {formState?.requiresMfa && (
                    <AuthInput
                        id="code"
                        name="code"
                        labelValue="Authenticator code"
                        autoComplete="one-time-code"
                        inputMode="numeric"
                        maxLength={6}
                        zodErrorMsg={formState.zodErrors?.code}
                    />
                )}
                {formState?.message && <p role="status">{formState.message}</p>}
                {formState?.strapiErrorsDetails &&
                formState?.strapiErrorsDetails.length ? (
                    formState?.strapiErrorsDetails.map((error, i) => (
                        <StrapiErrors key={i} error={error} />
                    ))
                ) : (
                    <StrapiErrors error={formState?.strapiErrors} />
                )}
                <Button
                    text="Sign In"
                    theme="dark"
                    type="submit"
                    isLoading={pending}
                    className="w-full"
                />
                <div className="flex flex-wrap justify-center items-center gap-2">
                    <p>Don&apos;t have an account?</p>
                    <Link href="/signUp" className="underline">
                        Sign Up
                    </Link>
                </div>
                <Link href="/forgotPassword" className="text-center underline">
                    Forgot password?
                </Link>
                <Link href="/verifyEmail" className="text-center underline">
                    Resend verification email
                </Link>
            </form>
        </AuthShell>
    );
}
