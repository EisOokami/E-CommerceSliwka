"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import {
    changePasswordAction,
    updateProfileAction,
} from "@/data/actions/profileActions";
import { getStrapiMedia } from "@/lib/utils";
import { RiImageAddFill } from "react-icons/ri";
import { IoPersonOutline } from "react-icons/io5";
import { GoShieldLock } from "react-icons/go";
import { AccountDetailsProps } from "./AccountDetails.interfaces";

import Button from "@/components/ui/button/Button";
import { StrapiErrors } from "@/components/ui/strapiErrors/StrapiErrors";
import { ZodErrors } from "@/components/ui/zodErrors/ZodErrors";
import CustomInput from "@/components/ui/accountInput/AccountInput";

const INITIAL_STATE = {
    zodErrors: null,
    data: null,
    strapiErrors: null,
    message: null,
};

export default function AccountDetails({
    userData,
}: Readonly<AccountDetailsProps>) {
    const [imageFromUpload, setImageFromUpload] = useState<File[] | null>([]);
    const updateProfileWithId = updateProfileAction.bind(
        null,
        userData.id,
        imageFromUpload,
    );
    const changePasswordWithId = changePasswordAction.bind(null, userData.id);
    const [
        accountSettingFormState,
        accountSettingFormAction,
        isPendingAccountSetting,
    ] = useActionState(updateProfileWithId, INITIAL_STATE);
    const [
        changePasswordFormState,
        changePasswordFormAction,
        isPendingChangePassword,
    ] = useActionState(changePasswordWithId, INITIAL_STATE);

    const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files);

            setImageFromUpload([...filesArray]);
        }
    };

    return (
        <main className="grid gap-10 w-full">
            <section className="grid gap-7">
                <div className="flex items-center gap-1">
                    <IoPersonOutline className="md:mt-1 text-3xl" />
                    <h1 className="text-2xl md:text-3xl xl:text-4xl font-medium">
                        Account Settings
                    </h1>
                </div>
                <form
                    className="grid gap-5"
                    action={accountSettingFormAction}
                    noValidate
                >
                    <div className="grid md:flex md:items-start gap-5">
                        <div className="grid place-items-center gap-3 w-full md:w-auto">
                            <label
                                htmlFor="avatar"
                                className="relative block w-64 h-64 mr-5 border-[6px] rounded-full overflow-hidden"
                            >
                                <Image
                                    src={
                                        imageFromUpload &&
                                        imageFromUpload.length
                                            ? URL.createObjectURL(
                                                  imageFromUpload[0],
                                              )
                                            : userData.avatar
                                            ? `${getStrapiMedia(
                                                  userData.avatar.url,
                                              )}`
                                            : "/avatar.png"
                                    }
                                    alt="avatar"
                                    width={300}
                                    height={300}
                                    className="w-64 h-64 object-cover"
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
                            <ZodErrors
                                error={
                                    accountSettingFormState?.zodErrors?.avatar
                                }
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full h-full">
                            <CustomInput
                                defaultValue={userData.username}
                                id="username"
                                name="username"
                                labelValue="Username"
                                zodErrorMsg={
                                    accountSettingFormState?.zodErrors?.username
                                }
                            />
                            <CustomInput
                                defaultValue={userData.email}
                                id="email"
                                name="email"
                                type="email"
                                labelValue="Email"
                                zodErrorMsg={
                                    accountSettingFormState?.zodErrors?.email
                                }
                            />
                            <div className="self-end grid gap-2">
                                <StrapiErrors
                                    error={
                                        accountSettingFormState?.strapiErrors
                                    }
                                />
                                {isPendingAccountSetting ? (
                                    <Button
                                        text="Loading"
                                        theme="dark"
                                        type="button"
                                        className="w-full md:w-fit"
                                        isLoading
                                    />
                                ) : (
                                    <Button
                                        text="Update profile"
                                        theme="dark"
                                        type="submit"
                                        className="w-full md:w-fit"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </section>
            <section className="grid gap-7">
                <div className="flex items-center gap-1">
                    <GoShieldLock className="md:mt-1 text-3xl" />
                    <h1 className="text-2xl md:text-3xl xl:text-4xl font-medium">
                        Change Password
                    </h1>
                </div>
                <form
                    className="grid gap-5"
                    action={changePasswordFormAction}
                    noValidate
                >
                    <div className="grid md:flex md:items-start gap-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                            <CustomInput
                                id="reset-password"
                                name="reset-password"
                                type="password"
                                labelValue="Reset password"
                                zodErrorMsg={
                                    changePasswordFormState?.zodErrors
                                        ?.passwordReset
                                }
                            />
                            <CustomInput
                                id="confirm-reset-password"
                                name="confirm-reset-password"
                                type="password"
                                labelValue="Confirm reset password"
                                zodErrorMsg={
                                    changePasswordFormState?.zodErrors
                                        ?.confirmResetPassword
                                }
                            />
                            <CustomInput
                                id="password"
                                name="password"
                                type="password"
                                labelValue="Password"
                                zodErrorMsg={
                                    changePasswordFormState?.zodErrors?.password
                                }
                            />
                            <CustomInput
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                                labelValue="Confirm password"
                                zodErrorMsg={
                                    changePasswordFormState?.zodErrors
                                        ?.confirmPassword
                                }
                            />
                            <div className="grid gap-2">
                                <StrapiErrors
                                    error={
                                        changePasswordFormState?.strapiErrors
                                    }
                                />
                                {isPendingChangePassword ? (
                                    <Button
                                        text="Loading"
                                        theme="dark"
                                        type="submit"
                                        className="w-full md:w-fit"
                                        isLoading
                                    />
                                ) : (
                                    <Button
                                        text="Change Password"
                                        theme="dark"
                                        type="submit"
                                        className="w-full md:w-fit"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </section>
        </main>
    );
}
