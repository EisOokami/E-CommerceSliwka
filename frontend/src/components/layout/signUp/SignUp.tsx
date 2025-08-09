"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerUserAction } from "@/data/actions/authActions";
import { SignUpProps } from "./SignUp.interfaces";

import Button from "@/components/ui/button/Button";
import { StrapiErrors } from "@/components/ui/strapiErrors/StrapiErrors";
import StrapiImage from "@/components/ui/strapiImage/StrapiImage";
import AuthInput from "@/components/ui/authInput/AuthInput";
import { ZodErrors } from "@/components/ui/zodErrors/ZodErrors";

const INITIAL_STATE = {
    zodErrors: null,
    strapiErrors: null,
    data: null,
    message: null,
    strapiErrorsDetails: null,
    formData: null,
};

export default function SignUp({ pageData }: Readonly<SignUpProps>) {
    const [formState, formAction] = useActionState(
        registerUserAction,
        INITIAL_STATE,
    );

    return (
        <>
            <section className="hidden md:block w-1/2 bg-gray-100">
                <Link
                    href={pageData.link.url}
                    className="block w-full h-full"
                    target="_blank"
                >
                    <StrapiImage
                        src={pageData.banner.url}
                        alt={
                            pageData.banner.alternativeText ??
                            pageData.link.text
                        }
                        width={1500}
                        height={1500}
                        className="w-full h-full object-cover"
                    />
                </Link>
            </section>
            <section className="grid content-center md:place-items-center w-full md:w-1/2 container mx-auto px-5">
                <form
                    action={formAction}
                    className="grid gap-6 md:w-2/3 md:p-5"
                    noValidate
                >
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
                            formState?.formData
                                ? formState?.formData.get("username")
                                : null
                        }
                    />
                    <AuthInput
                        id="email"
                        name="email"
                        type="email"
                        labelValue="Email"
                        zodErrorMsg={formState?.zodErrors?.email}
                        defaultValue={
                            formState?.formData
                                ? formState?.formData.get("email")
                                : null
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
                                ? formState?.formData.get("password")
                                : null
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
                        formState?.strapiErrorsDetails.map(
                            (
                                error: {
                                    path: string;
                                    message: string;
                                    name: string;
                                    value: string;
                                },
                                i: number,
                            ) => <StrapiErrors key={i} error={error} />,
                        )
                    ) : (
                        <StrapiErrors error={formState?.strapiErrors} />
                    )}
                    <Button
                        text="Sign Up"
                        theme="dark"
                        type="submit"
                        className="w-full"
                    />
                    <div className="flex justify-center items-center gap-2">
                        <p>Have an account?</p>
                        <Link href="/signIn" className="underline">
                            Sign In
                        </Link>
                    </div>
                </form>
            </section>
        </>
    );
}
