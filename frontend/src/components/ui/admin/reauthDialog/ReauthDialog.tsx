"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { errorMessage } from "@/data/admin/services/client";
import { Field } from "../apiState/ApiState";
import { ReauthDialogProps } from "./ReauthDialog.interfaces";
import {
    fieldClass,
    outlineButtonClass,
    solidButtonClass,
} from "@/constants/styles";

export default function ReauthDialog({
    title,
    mfa,
    action,
    finish,
}: Readonly<ReauthDialogProps>) {
    const ref = useRef<HTMLDialogElement>(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const dialog = ref.current;

        if (!dialog) {
            return;
        }

        dialog.showModal();

        return () => dialog.close();
    }, []);

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (busy) {
            return;
        }

        const form = event.currentTarget;
        const data = new FormData(form);

        setBusy(true);
        setError("");

        try {
            await action({
                password: String(data.get("password")),
                ...(mfa ? { code: String(data.get("code")) } : {}),
            });

            form.reset();

            finish(true);
        } catch (reason) {
            setError(errorMessage(reason));

            form.reset();
        } finally {
            setBusy(false);
        }
    };

    return (
        <dialog
            ref={ref}
            onCancel={(event) => {
                event.preventDefault();

                if (!busy) {
                    finish(false);
                }
            }}
            className="w-[calc(100%-2.5rem)] max-w-md max-h-[calc(100svh-2.5rem)] overflow-y-auto rounded-lg border border-gray-200 bg-white p-6 shadow-xl backdrop:bg-black/40"
        >
            <form onSubmit={submit} className="space-y-4">
                <h2
                    id="reauth-title"
                    className="text-2xl font-medium text-black"
                >
                    {title}
                </h2>
                <p className="text-sm text-gray-500">
                    Confirm this action with your current password
                    {mfa ? " and a new authenticator code" : ""}.
                </p>
                <Field label="Current password">
                    <input
                        autoFocus
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        maxLength={255}
                        className={fieldClass}
                        disabled={busy}
                    />
                </Field>
                {mfa && (
                    <Field label="Authentication code">
                        <input
                            name="code"
                            autoComplete="one-time-code"
                            inputMode="numeric"
                            pattern="[0-9]{6}"
                            maxLength={6}
                            required
                            className={fieldClass}
                            disabled={busy}
                        />
                    </Field>
                )}
                {error && (
                    <p role="alert" className="text-sm text-red-600">
                        {error}
                    </p>
                )}
                <div className="flex flex-wrap justify-end gap-2">
                    <button
                        type="button"
                        disabled={busy}
                        onClick={() => finish(false)}
                        className={outlineButtonClass}
                    >
                        Cancel
                    </button>
                    <button disabled={busy} className={solidButtonClass}>
                        {busy ? "Confirming..." : "Confirm action"}
                    </button>
                </div>
            </form>
        </dialog>
    );
}
