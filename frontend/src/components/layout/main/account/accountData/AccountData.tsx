"use client";

import { useActionState, useState, useTransition } from "react";
import {
    deleteAccountAction,
    requestAccountDeletionCodeAction,
} from "@/data/main/actions/profileActions";
import type { IDeleteAccountAction } from "@/interfaces/data";
import { LuDatabase, LuDownload } from "react-icons/lu";
import { AccountDataProps } from "./AccountData.interfaces";

import { outlineButtonClass } from "@/constants/styles";
import Button from "@/components/ui/main/button/Button";
import AccountInput from "@/components/ui/main/accountInput/AccountInput";
import { StrapiErrors } from "@/components/ui/main/strapiErrors/StrapiErrors";
import { ZodErrors } from "@/components/ui/main/zodErrors/ZodErrors";

const INITIAL_STATE: IDeleteAccountAction = {
    zodErrors: null,
    strapiErrors: null,
    strapiErrorsDetails: null,
    message: null,
    formData: null,
    codeSent: false,
};

export default function AccountData({ userData }: Readonly<AccountDataProps>) {
    const deleteAccountWithId = deleteAccountAction.bind(null, userData.id);
    const [deleteState, deleteFormAction, isDeleting] = useActionState(
        deleteAccountWithId,
        INITIAL_STATE,
    );
    const [codeState, setCodeState] = useState<IDeleteAccountAction | null>(
        null,
    );
    const [isSendingCode, startSendingCode] = useTransition();

    const codeSent = !!(deleteState.codeSent || codeState?.codeSent);

    const handleSendCode = () => {
        startSendingCode(async () => {
            setCodeState(await requestAccountDeletionCodeAction());
        });
    };

    return (
        <section className="grid gap-7">
            <div className="flex items-center gap-1">
                <LuDatabase className="md:mt-1 text-3xl" />
                <h1 className="text-2xl md:text-3xl xl:text-4xl font-medium">
                    Your Data
                </h1>
            </div>
            <div className="grid gap-3">
                <p className="text-gray-600 text-pretty">
                    Download a copy of the personal data stored about your
                    account (profile, sessions, cart, wishlist, demo orders and
                    reviews) as a JSON file.
                </p>
                <a
                    href="/account/export"
                    download
                    className={`${outlineButtonClass} w-full md:w-fit`}
                >
                    <LuDownload className="text-lg" />
                    Download my data
                </a>
            </div>
            <div className="grid gap-4 p-5 md:p-8 border border-red-200 rounded-xl">
                <h2 className="text-xl md:text-2xl font-medium text-red-600">
                    Delete account
                </h2>
                <p className="text-gray-600 text-pretty">
                    This permanently deletes your account together with your
                    avatar, reviews and their photos, cart, wishlist, demo
                    orders, sessions and sign-in history. It cannot be undone.
                </p>
                <form
                    action={deleteFormAction}
                    className="grid gap-4"
                    noValidate
                >
                    <input
                        type="hidden"
                        name="delete-code-sent"
                        value={codeSent ? "true" : "false"}
                    />
                    {userData.hasPassword ? (
                        <AccountInput
                            id="delete-password"
                            name="delete-password"
                            type="password"
                            autoComplete="current-password"
                            labelValue="Your password"
                            zodErrorMsg={deleteState.zodErrors?.password}
                            containerClassName="place-self-start md:max-w-md"
                        />
                    ) : (
                        <div className="grid gap-3">
                            <p className="text-pretty">
                                Your account has no password, so we will email
                                you a six-digit code to confirm the deletion.
                            </p>
                            <Button
                                text={
                                    codeSent
                                        ? "Send a new code"
                                        : "Email me a code"
                                }
                                theme="dark"
                                inline
                                type="button"
                                onClick={handleSendCode}
                                isLoading={isSendingCode}
                                className="w-full md:w-fit"
                            />
                            {codeState?.message && !codeState.strapiErrors ? (
                                <p>{codeState.message}</p>
                            ) : null}
                            <StrapiErrors error={codeState?.strapiErrors} />
                            {codeSent && (
                                <AccountInput
                                    id="delete-code"
                                    name="delete-code"
                                    inputMode="numeric"
                                    autoComplete="one-time-code"
                                    maxLength={6}
                                    labelValue="Code from the email"
                                    zodErrorMsg={
                                        deleteState.zodErrors?.code ??
                                        deleteState.zodErrors?.password
                                    }
                                    containerClassName="place-self-start md:max-w-md"
                                />
                            )}
                        </div>
                    )}
                    <div>
                        <label className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                name="delete-confirm"
                                className="mt-1.5"
                            />
                            <span>
                                I understand that my account and data will be
                                deleted permanently.
                            </span>
                        </label>
                        <ZodErrors error={deleteState.zodErrors?.confirm} />
                    </div>
                    <StrapiErrors error={deleteState.strapiErrors} />
                    {userData.hasPassword || codeSent ? (
                        <Button
                            text="Delete account permanently"
                            theme="dark"
                            type="submit"
                            isLoading={isDeleting}
                            className="w-full md:w-fit bg-red-600 hover:bg-red-700 border-red-600"
                        />
                    ) : null}
                </form>
            </div>
        </section>
    );
}
