"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginUserAction } from "@/data/actions/authActions";

import Button from "@/components/ui/button/Button";
import { ZodErrors } from "@/components/ui/zodErrors/ZodErrors";
import { StrapiErrors } from "@/components/ui/strapiErrors/StrapiErrors";

const INITIAL_STATE = {
    zodErrors: null,
    strapiErrors: null,
    data: null,
    message: null,
};

export default function SignIn() {
    const [formState, formAction] = useActionState(
        loginUserAction,
        INITIAL_STATE,
    );

    return (
        <>
            <section className="hidden md:block w-1/2 bg-gray-100">
                <div></div>
            </section>
            <section className="grid content-center md:place-items-center w-full md:w-1/2 container mx-auto px-3 md:px-5">
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
                    <div className="relative">
                        <input
                            className="w-full px-4 pt-5 pb-4 text-gray-700 border rounded-lg  appearance-none leading-tight focus:outline-none peer"
                            id="email"
                            name="email"
                            type="email"
                            placeholder=" "
                        />
                        <label
                            className="absolute left-4 pt-1 text-gray-700 text-sm font-bold transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:left-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:left-4 peer-focus:text-sm peer-focus:text-gray-700"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <ZodErrors error={formState?.zodErrors?.email} />
                    </div>
                    <div className="relative">
                        <input
                            className="w-full px-4 pt-5 pb-4 text-gray-700 border rounded-lg  appearance-none leading-tight focus:outline-none peer"
                            id="password"
                            name="password"
                            type="password"
                            placeholder=" "
                        />
                        <label
                            className="absolute left-4 pt-1 text-gray-700 text-sm font-bold transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:left-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:left-4 peer-focus:text-sm peer-focus:text-gray-700"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <ZodErrors error={formState?.zodErrors?.password} />
                    </div>
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
