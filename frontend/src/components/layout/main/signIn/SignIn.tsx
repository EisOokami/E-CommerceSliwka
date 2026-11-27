"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { loginUserAction } from "@/data/main/actions/authActions";
import { SignInProps } from "./SignIn.interfaces";

import Button from "@/components/ui/main/button/Button";
import { StrapiErrors } from "@/components/ui/main/strapiErrors/StrapiErrors";
import AuthShell from "@/components/layout/main/authShell/AuthShell";
import AuthInput from "@/components/ui/main/authInput/AuthInput";
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
        "To continue with Google, accept the Terms of Service and confirm that you have read the Privacy Policy.",
    email_not_verified:
        "Your Google account email is not verified. Verify it with Google or sign in with a password.",
    oauth_state_mismatch:
        "Google sign-in expired or was interrupted. Please try again.",
    oauth_failed: "Google sign-in failed. Please try again.",
};

export default function SignIn({
    pageData,
    error,
    mfaPending = false,
}: Readonly<SignInProps>) {
    const [formState, formAction, pending] = useActionState(loginUserAction, {
        ...INITIAL_STATE,
        requiresMfa: mfaPending,
    });
    const [googleTermsAccepted, setGoogleTermsAccepted] = useState(false);
    const googleTermsRequired = error === "terms_required";

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
                {formState?.requiresTermsAcceptance &&
                    !formState?.requiresMfa && (
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                name="acceptTerms"
                                id="acceptTerms"
                            />
                            <label htmlFor="acceptTerms">
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
                    )}
                {error && OAUTH_ERRORS[error] && !formState?.message && (
                    <p className="text-red-600">{OAUTH_ERRORS[error]}</p>
                )}
                {formState?.message && <p>{formState.message}</p>}
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
                {isGoogleSignInAvailable && !formState?.requiresMfa && (
                    <div className="grid gap-4">
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span className="h-px flex-1 bg-gray-200" />
                            or
                            <span className="h-px flex-1 bg-gray-200" />
                        </div>
                        {googleTermsRequired && (
                            <div className="flex gap-2">
                                <input
                                    type="checkbox"
                                    id="googleTerms"
                                    checked={googleTermsAccepted}
                                    onChange={(event) =>
                                        setGoogleTermsAccepted(
                                            event.target.checked,
                                        )
                                    }
                                />
                                <label htmlFor="googleTerms">
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
                        )}
                        <GoogleButton
                            termsAccepted={googleTermsAccepted}
                            disabled={
                                googleTermsRequired && !googleTermsAccepted
                            }
                        />
                    </div>
                )}
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
