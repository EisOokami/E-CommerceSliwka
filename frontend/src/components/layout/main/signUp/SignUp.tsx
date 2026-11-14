"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerUserAction } from "@/data/main/actions/authActions";
import { SignUpProps } from "./SignUp.interfaces";

import Button from "@/components/ui/main/button/Button";
import { StrapiErrors } from "@/components/ui/main/strapiErrors/StrapiErrors";
import AuthShell from "@/components/layout/main/authShell/AuthShell";
import AuthInput from "@/components/ui/main/authInput/AuthInput";
import { ZodErrors } from "@/components/ui/main/zodErrors/ZodErrors";

const INITIAL_STATE = {
    zodErrors: null,
    strapiErrors: null,
    message: null,
    strapiErrorsDetails: null,
    formData: null,
};

export default function SignUp({ pageData }: Readonly<SignUpProps>) {
    const [formState, formAction, pending] = useActionState(
        registerUserAction,
        INITIAL_STATE,
    );

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
                        />
                        <label htmlFor="terms-and-policy">
                            I agree to the{" "}
                            <a href="#" className="underline">
                                Terms & Privacy
                            </a>
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
                {formState?.message && <p role="status">{formState.message}</p>}
                <Button
                    text="Sign Up"
                    theme="dark"
                    type="submit"
                    isLoading={pending}
                    className="w-full"
                />
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
