"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import {
    updateAvatarAction,
    updateProfileAction,
} from "@/data/actions/profileActions";
import { RiImageAddFill } from "react-icons/ri";
import { AccountProps } from "./Account.interfaces";

import Button from "@/components/ui/button/Button";
import { StrapiErrors } from "@/components/ui/strapiErrors/StrapiErrors";
import { ZodErrors } from "@/components/ui/zodErrors/ZodErrors";

const INITIAL_STATE = {
    zodErrors: null,
    data: null,
    strapiErrors: null,
    message: null,
};

export default function Account({ data }: Readonly<AccountProps>) {
    const [imageFromUpload, setImageFromUpload] = useState<File[] | null>([]);
    const updateProfileWithId = updateProfileAction.bind(null, data.id);
    const [formState, formAction] = useActionState(
        updateProfileWithId,
        INITIAL_STATE,
    );

    const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files);

            setImageFromUpload((prevState) => [
                ...(prevState || []),
                ...filesArray,
            ]);
        }
    };

    const handleUpdateAvatar = () => {
        updateAvatarAction(data.id, imageFromUpload, INITIAL_STATE);
    };

    return (
        <section className="container mx-auto px-3 py-10 md:px-5">
            <div className="grid gap-7">
                <h1 className="text-2xl md:text-3xl xl:text-4xl font-medium">
                    Account Settings
                </h1>
                <form className="grid gap-5" action={formAction} noValidate>
                    <div className="grid md:flex md:items-start gap-5">
                        <div className="grid place-items-center gap-3 w-full md:w-auto">
                            <label
                                htmlFor="avatar"
                                className="relative block max-w-64 w-full mr-5 border-[6px] rounded-full overflow-hidden"
                            >
                                <Image
                                    src={
                                        imageFromUpload &&
                                        imageFromUpload.length
                                            ? URL.createObjectURL(
                                                  imageFromUpload[0],
                                              )
                                            : process.env.NEXT_PUBLIC_DB_URL +
                                              data.avatar.url
                                    }
                                    alt="avatar"
                                    width={300}
                                    height={300}
                                    className="w-80"
                                />
                                <div className="absolute top-0 grid place-content-center w-full h-full bg-gray-400/30 rounded-full opacity-0 hover:opacity-100 transition cursor-pointer">
                                    <RiImageAddFill className="text-5xl text-white" />
                                </div>
                            </label>
                            <input
                                type="file"
                                name="avatar"
                                id="avatar"
                                className="hidden"
                                onChange={onImageChange}
                                accept=".jpg, .jpeg, .png, .webp"
                            />
                            <ZodErrors error={formState?.zodErrors?.avatar} />
                            <Button
                                type="button"
                                text="Update avatar"
                                theme="dark"
                                onClick={handleUpdateAvatar}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
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
                                <ZodErrors
                                    error={formState?.zodErrors?.username}
                                />
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
                                <ZodErrors
                                    error={formState?.zodErrors?.email}
                                />
                            </div>
                            <div className="relative place-self-center max-w-[1000px] w-full">
                                <input
                                    className="max-w-[1000px] w-full px-4 pt-5 pb-4 text-gray-700 border rounded-lg appearance-none leading-tight focus:outline-none peer"
                                    id="password"
                                    name="reset-password"
                                    type="password"
                                    placeholder=" "
                                />
                                <label
                                    className="absolute left-4 pt-1 text-gray-700 text-sm font-bold transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:left-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:left-4 peer-focus:text-sm peer-focus:text-gray-700"
                                    htmlFor="reset-password"
                                >
                                    Reset password
                                </label>
                                <ZodErrors
                                    error={formState?.zodErrors?.passwordReset}
                                />
                            </div>
                            <div className="relative place-self-center max-w-[1000px] w-full">
                                <input
                                    className="max-w-[1000px] w-full px-4 pt-5 pb-4 text-gray-700 border rounded-lg appearance-none leading-tight focus:outline-none peer"
                                    id="confirm-reset-password"
                                    name="confirm-reset-password"
                                    type="password"
                                    placeholder=" "
                                />
                                <label
                                    className="absolute left-4 pt-1 text-gray-700 text-sm font-bold transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:left-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:left-4 peer-focus:text-sm peer-focus:text-gray-700"
                                    htmlFor="confirm-reset-password"
                                >
                                    Confirm reset password
                                </label>
                                <ZodErrors
                                    error={
                                        formState?.zodErrors
                                            ?.confirmResetPassword
                                    }
                                />
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
                                    Password
                                </label>
                                <ZodErrors
                                    error={formState?.zodErrors?.password}
                                />
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
                                    Confirm password
                                </label>
                                <ZodErrors
                                    error={
                                        formState?.zodErrors?.confirmPassword
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Button
                                    text="Update profile"
                                    theme="dark"
                                    type="submit"
                                />
                                <StrapiErrors error={formState?.strapiErrors} />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
}
