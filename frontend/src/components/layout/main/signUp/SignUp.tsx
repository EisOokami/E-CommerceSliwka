"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { registerUserAction } from "@/data/main/actions/authActions";
import { SignUpProps } from "./SignUp.interfaces";

import Button from "@/components/ui/main/button/Button";
import { StrapiErrors } from "@/components/ui/main/strapiErrors/StrapiErrors";
import AuthShell from "@/components/layout/main/authShell/AuthShell";
import AuthInput from "@/components/ui/main/authInput/AuthInput";
import { ZodErrors } from "@/components/ui/main/zodErrors/ZodErrors";
import GoogleButton, {
    isGoogleSignInAvailable,
} from "@/components/ui/main/googleButton/GoogleButton";

const INITIAL_STATE = {
    zodErrors: null,
    strapiErrors: null,
    message: null,
    strapiErrorsDetails: null,
    formData: null,
};

const OAUTH_ERRORS: Record<string, string> = {
    terms_required:
        "To create an account with Google, tick the Terms of Service checkbox first, then use Continue with Google.",
};

export default function SignUp({ pageData, error }: Readonly<SignUpProps>) {
    const [formState, formAction, pending] = useActionState(
        registerUserAction,
        INITIAL_STATE,
    );
    const [termsAccepted, setTermsAccepted] = useState(false);

    return (
        <AuthShell pageData={pageData}>
            <form action={formAction} className="grid gap-6" noValidate>
                <div className="grid gap-1">
                    <h2 className="text-5xl font-bold">Sign Up</h2>
                    <p className="text-gray-500">
                        Enter your details to create a new account
                    </p>
                </div>
                <AuthInput
                    id="username"
                    name="username"
                    labelValue="Username"
                    zodErrorMsg={formState?.zodErrors?.username}
                    defaultValue={
                        formState?.formData?.get("username")?.toString() ??
                        undefined
                    }
                />
                <AuthInput
                    id="email"
                    name="email"
                    type="email"
                    labelValue="Email"
                    zodErrorMsg={formState?.zodErrors?.email}
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
                        formState?.formData?.get("password")?.toString() ??
                        undefined
                    }
                />
                <div className="relative">
                    <div className="flex gap-2">
                        <input
                            type="checkbox"
                            name="terms-and-policy"
                            id="terms-and-policy"
                            checked={termsAccepted}
                            onChange={(event) =>
                                setTermsAccepted(event.target.checked)
                            }
                        />
                        <label htmlFor="terms-and-policy">
                            I accept the{" "}
                            <Link
                                href="/terms"
                                target="_blank"
                                className="underline"
                            >
                                Terms of Service
                            </Link>{" "}
                            and confirm that I have read the{" "}
                            <Link
                                href="/privacy"
                                target="_blank"
                                className="underline"
                            >
                                Privacy Policy
                            </Link>
                        </label>
                    </div>
                    <ZodErrors
                        error={formState?.zodErrors?.agreeToTermsAndPrivacy}
                    />
                </div>
                {formState?.strapiErrorsDetails &&
                formState?.strapiErrorsDetails.length ? (
                    formState?.strapiErrorsDetails.map((error, i) => (
                        <StrapiErrors key={i} error={error} />
                    ))
                ) : (
                    <StrapiErrors error={formState?.strapiErrors} />
                )}
                {error && OAUTH_ERRORS[error] && !formState?.message && (
                    <p className="text-red-600">{OAUTH_ERRORS[error]}</p>
                )}
                {formState?.message && <p>{formState.message}</p>}
                <Button
                    text="Sign Up"
                    theme="dark"
                    type="submit"
                    isLoading={pending}
                    className="w-full"
                />
                {isGoogleSignInAvailable && (
                    <div className="grid gap-4">
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span className="h-px flex-1 bg-gray-200" />
                            or
                            <span className="h-px flex-1 bg-gray-200" />
                        </div>
                        <GoogleButton
                            termsAccepted={termsAccepted}
                            disabled={!termsAccepted}
                        />
                    </div>
                )}
                <div className="flex flex-wrap justify-center items-center gap-2">
                    <p>Have an account?</p>
                    <Link href="/signIn" className="underline">
                        Sign In
                    </Link>
                </div>
            </form>
        </AuthShell>
    );
}
