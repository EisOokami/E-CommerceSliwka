"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginUserAction } from "@/data/actions/authActions";
import { SignInProps } from "./SignIn.interfaces";

import Button from "@/components/ui/button/Button";
import { StrapiErrors } from "@/components/ui/strapiErrors/StrapiErrors";
import StrapiImage from "@/components/ui/strapiImage/StrapiImage";
import AuthInput from "@/components/ui/authInput/AuthInput";

const INITIAL_STATE = {
    zodErrors: null,
    strapiErrors: null,
    data: null,
    message: null,
};

export default function SignIn({ pageData }: Readonly<SignInProps>) {
    const [formState, formAction] = useActionState(
        loginUserAction,
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
                        <h2 className="text-5xl font-bold">Sign In</h2>
                        <p className="text-gray-500">
                            Enter your details to sign in to your account
                        </p>
                    </div>
                    <AuthInput
                        id="email"
                        name="email"
                        type="email"
                        labelValue="Email"
                        zodErrorMsg={formState?.zodErrors?.email}
                    />
                    <AuthInput
                        id="password"
                        name="password"
                        type="password"
                        labelValue="Password"
                        zodErrorMsg={formState?.zodErrors?.password}
                    />
                    <StrapiErrors error={formState?.strapiErrors} />
                    <Button
                        text="Sign In"
                        theme="dark"
                        type="submit"
                        className="w-full"
                    />
                    <div className="flex justify-center items-center gap-2">
                        <p>Don&apos;t have an account?</p>
                        <Link href="/signUp" className="underline">
                            Sign Up
                        </Link>
                    </div>
                </form>
            </section>
        </>
    );
}
