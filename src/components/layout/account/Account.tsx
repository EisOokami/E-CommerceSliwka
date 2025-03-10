"use client";

import { useActionState } from "react";
import Button from "@/components/ui/button/Button";
import { updateProfileAction } from "@/data/actions/profileActions";
import { AccountProps } from "./Account.interfaces";
import { StrapiErrors } from "@/components/ui/strapiErrors/StrapiErrors";
import { ZodErrors } from "@/components/ui/zodErrors/ZodErrors";

const INITIAL_STATE = {
    zodErrors: null,
    data: null,
    strapiErrors: null,
    message: null,
};

export default function Account({ data }: Readonly<AccountProps>) {
    const updateProfileWithId = updateProfileAction.bind(null, data.id);

    const [formState, formAction] = useActionState(
        updateProfileWithId,
        INITIAL_STATE,
    );

    return (
        <section className="md:h-[490px] container mx-auto px-3 py-10 md:px-5">
            <div className="grid gap-7">
                <h1 className="text-2xl md:text-3xl xl:text-4xl font-medium">
                    Account Settings
                </h1>
                <form className="grid gap-3" action={formAction} noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="relative place-self-center max-w-[1000px] w-full">
                            <input
                                className="max-w-[1000px] w-full px-4 pt-5 pb-4 text-gray-700 border rounded-lg appearance-none leading-tight focus:outline-none peer"
                                id="username"
                                name="username"
                                type="text"
                                defaultValue={data?.username || ""}
                                placeholder=" "
                            />
                            <label
                                className="absolute left-4 pt-1 text-gray-700 text-sm font-bold transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:left-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:left-4 peer-focus:text-sm peer-focus:text-gray-700"
                                htmlFor="username"
                            >
                                Username
                            </label>
                            <ZodErrors error={formState?.zodErrors?.username} />
                        </div>
                        <div className="relative place-self-center max-w-[1000px] w-full">
                            <input
                                className="max-w-[1000px] w-full px-4 pt-5 pb-4 text-gray-700 border rounded-lg appearance-none leading-tight focus:outline-none peer"
                                id="email"
                                name="email"
                                type="email"
                                defaultValue={data?.email || ""}
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
                        <div className="relative place-self-center max-w-[1000px] w-full">
                            <input
                                className="max-w-[1000px] w-full px-4 pt-5 pb-4 text-gray-700 border rounded-lg appearance-none leading-tight focus:outline-none peer"
                                id="password"
                                name="password"
                                type="password"
                                placeholder=" "
                            />
                            <label
                                className="absolute left-4 pt-1 text-gray-700 text-sm font-bold transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:left-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:left-4 peer-focus:text-sm peer-focus:text-gray-700"
                                htmlFor="password"
                            >
                                Reset password
                            </label>
                            <ZodErrors error={formState?.zodErrors?.password} />
                        </div>
                        <div className="relative place-self-center max-w-[1000px] w-full">
                            <input
                                className="max-w-[1000px] w-full px-4 pt-5 pb-4 text-gray-700 border rounded-lg appearance-none leading-tight focus:outline-none peer"
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                                placeholder=" "
                            />
                            <label
                                className="absolute left-4 pt-1 text-gray-700 text-sm font-bold transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:left-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:left-4 peer-focus:text-sm peer-focus:text-gray-700"
                                htmlFor="confirm-password"
                            >
                                Confirm reset password
                            </label>
                            <ZodErrors
                                error={formState?.zodErrors?.confirmPassword}
                            />
                        </div>
                    </div>
                    <Button
                        text="Confirm"
                        theme="dark"
                        type="submit"
                        className=""
                    />
                    <StrapiErrors error={formState?.strapiErrors} />
                </form>
            </div>
        </section>
    );
}
