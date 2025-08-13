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
import AccountInput from "@/components/ui/accountInput/AccountInput";

const INITIAL_STATE = {
    zodErrors: null,
    data: null,
    strapiErrors: null,
    strapiErrorsDetails: null,
    message: null,
    formData: null,
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
    const [
        accountSettingFormState,
        accountSettingFormAction,
        isPendingAccountSetting,
    ] = useActionState(updateProfileWithId, INITIAL_STATE);
    const [
        changePasswordFormState,
        changePasswordFormAction,
        isPendingChangePassword,
    ] = useActionState(changePasswordAction, INITIAL_STATE);

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
                            <AccountInput
                                id="username"
                                name="username"
                                labelValue="Username"
                                zodErrorMsg={
                                    accountSettingFormState?.zodErrors?.username
                                }
                                defaultValue={
                                    accountSettingFormState?.formData
                                        ? accountSettingFormState?.formData.get(
                                              "username",
                                          )
                                        : userData.username
                                }
                            />
                            <AccountInput
                                id="email"
                                name="email"
                                type="email"
                                labelValue="Email"
                                zodErrorMsg={
                                    accountSettingFormState?.zodErrors?.email
                                }
                                defaultValue={
                                    accountSettingFormState?.formData
                                        ? accountSettingFormState?.formData.get(
                                              "email",
                                          )
                                        : userData.email
                                }
                            />
                            <div className="self-end grid gap-2">
                                {accountSettingFormState?.strapiErrorsDetails &&
                                accountSettingFormState?.strapiErrorsDetails
                                    .length ? (
                                    accountSettingFormState?.strapiErrorsDetails.map(
                                        (
                                            error: {
                                                path: string;
                                                message: string;
                                                name: string;
                                                value: string;
                                            },
                                            i: number,
                                        ) => (
                                            <StrapiErrors
                                                key={i}
                                                error={error}
                                            />
                                        ),
                                    )
                                ) : (
                                    <StrapiErrors
                                        error={
                                            accountSettingFormState?.strapiErrors
                                        }
                                    />
                                )}
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
                            <AccountInput
                                id="current-password"
                                name="current-password"
                                type="password"
                                labelValue="Current password"
                                zodErrorMsg={
                                    changePasswordFormState?.zodErrors
                                        ?.currentPassword
                                }
                                defaultValue={
                                    changePasswordFormState?.formData
                                        ? changePasswordFormState?.formData.get(
                                              "current-password",
                                          )
                                        : null
                                }
                            />
                            <AccountInput
                                id="confirm-current-password"
                                name="confirm-current-password"
                                type="password"
                                labelValue="Confirm current password"
                                zodErrorMsg={
                                    changePasswordFormState?.zodErrors
                                        ?.confirmCurrentPassword
                                }
                                defaultValue={
                                    changePasswordFormState?.formData
                                        ? changePasswordFormState?.formData.get(
                                              "confirm-current-password",
                                          )
                                        : null
                                }
                            />
                            <AccountInput
                                id="password"
                                name="password"
                                type="password"
                                labelValue="New password"
                                zodErrorMsg={
                                    changePasswordFormState?.zodErrors?.password
                                }
                                defaultValue={
                                    changePasswordFormState?.formData
                                        ? changePasswordFormState?.formData.get(
                                              "password",
                                          )
                                        : null
                                }
                            />
                            <AccountInput
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                                labelValue="Confirm new password"
                                zodErrorMsg={
                                    changePasswordFormState?.zodErrors
                                        ?.confirmPassword
                                }
                                defaultValue={
                                    changePasswordFormState?.formData
                                        ? changePasswordFormState?.formData.get(
                                              "confirm-password",
                                          )
                                        : null
                                }
                            />
                            <div className="grid gap-2">
                                {changePasswordFormState?.strapiErrorsDetails &&
                                changePasswordFormState?.strapiErrorsDetails
                                    .length ? (
                                    changePasswordFormState?.strapiErrorsDetails.map(
                                        (
                                            error: {
                                                path: string;
                                                message: string;
                                                name: string;
                                                value: string;
                                            },
                                            i: number,
                                        ) => (
                                            <StrapiErrors
                                                key={i}
                                                error={error}
                                            />
                                        ),
                                    )
                                ) : (
                                    <StrapiErrors
                                        error={
                                            changePasswordFormState?.strapiErrors
                                        }
                                    />
                                )}
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
