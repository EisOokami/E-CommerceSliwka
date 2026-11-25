"use client";

import { useState, type FormEvent } from "react";
import {
    revokeAdminSession,
    setupMfa,
    confirmMfa,
    disableMfa,
    changeAdminPassword,
} from "@/data/admin/services/services";
import { useServerData } from "@/data/admin/useServerData";
import { errorMessage } from "@/data/admin/services/client";
import {
    cardClass,
    fieldClass,
    outlineButtonClass,
    solidButtonClass,
} from "@/constants/styles";
import { SecurityProps } from "./Security.interfaces";

import { useAdminSession } from "../../auth/AdminSessionProvider";
import TopBar from "@/components/ui/admin/topBar/TopBar";
import SessionTable from "@/components/ui/admin/sessionTable/SessionTable";
import { ApiState, Field } from "@/components/ui/admin/apiState/ApiState";
import { cn } from "@/lib/utils";
import { LuRefreshCw } from "react-icons/lu";

export default function Security({ initialData }: Readonly<SecurityProps>) {
    const [uri, setUri] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const { admin, confirmAction, endSession, signOut } = useAdminSession();
    const state = useServerData(initialData);

    const passwordSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = event.currentTarget;
        const data = new FormData(form);
        const password = String(data.get("password"));

        if (password !== data.get("confirm")) {
            setError("New passwords do not match.");

            return;
        }

        setError("");
        setBusy(true);

        const done = await confirmAction(
            "Change your password and sign out all devices?",
            (credentials) => changeAdminPassword(password, credentials),
        );

        setBusy(false);

        if (done) {
            form.reset();

            endSession();
        }
    };

    const confirmSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = event.currentTarget;
        const code = String(new FormData(form).get("code"));

        setBusy(true);

        const done = await confirmAction(
            "Confirm your new authenticator?",
            (credentials) => confirmMfa(code, credentials),
        );

        setBusy(false);

        form.reset();

        if (done) {
            setUri("");

            endSession();
        }
    };

    return (
        <div className="flex-1 overflow-y-auto">
            <TopBar
                title="Security"
                crumbs={[
                    {
                        label: "Dashboard",
                        href: "/admin/dashboard",
                    },
                    {
                        label: "Security",
                    },
                ]}
                actions={
                    <button
                        onClick={state.reload}
                        className={cn(
                            solidButtonClass,
                            "h-9 px-6 md:text-sm gap-1.5",
                        )}
                    >
                        <LuRefreshCw size={12} />
                        Refresh
                    </button>
                }
            />
            <div className="p-6 space-y-4">
                <div className={cardClass}>
                    <h2 className="text-sm font-semibold">{admin.fullName}</h2>
                    <p className="text-sm text-gray-500">
                        {admin.email} · {admin.role}
                    </p>
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <div className="grid lg:grid-cols-2 gap-4">
                    <form
                        onSubmit={passwordSubmit}
                        className={cardClass + " space-y-4"}
                    >
                        <h2 className="text-sm font-semibold">Password</h2>
                        <Field label="New password">
                            <input
                                name="password"
                                type="password"
                                required
                                minLength={12}
                                maxLength={255}
                                autoComplete="new-password"
                                className={fieldClass}
                                disabled={busy}
                            />
                        </Field>
                        <Field label="Confirm new password">
                            <input
                                name="confirm"
                                type="password"
                                required
                                minLength={12}
                                maxLength={255}
                                autoComplete="new-password"
                                className={fieldClass}
                                disabled={busy}
                            />
                        </Field>
                        <button
                            disabled={busy}
                            className={cn(solidButtonClass, "h-10 px-6")}
                        >
                            Update password
                        </button>
                    </form>
                    <div className={cardClass + " space-y-4"}>
                        <h2 className="text-sm font-semibold">
                            Two-Factor Authentication
                        </h2>
                        <p className="text-sm text-gray-500">
                            {admin.mfaEnabled
                                ? "Your account is protected by an authenticator."
                                : "Add an authenticator to protect your account."}
                        </p>
                        <div className="flex gap-2">
                            <button
                                disabled={busy}
                                className={cn(solidButtonClass, "h-10 px-6")}
                                onClick={async () => {
                                    setBusy(true);

                                    await confirmAction(
                                        admin.mfaEnabled
                                            ? "Replace your authenticator?"
                                            : "Set up two-factor authentication?",
                                        async (credentials) => {
                                            const result =
                                                await setupMfa(credentials);

                                            setUri(result.uri);
                                        },
                                    );

                                    setBusy(false);
                                }}
                            >
                                {admin.mfaEnabled
                                    ? "Replace authenticator"
                                    : "Enable 2FA"}
                            </button>
                            {admin.mfaEnabled && (
                                <button
                                    disabled={busy}
                                    onClick={async () => {
                                        if (
                                            await confirmAction(
                                                "Disable two-factor authentication?",
                                                disableMfa,
                                            )
                                        ) {
                                            endSession();
                                        }
                                    }}
                                    className={cn(
                                        solidButtonClass,
                                        "border-red-600 bg-red-600 text-white hover:bg-red-700 h-10 px-6",
                                    )}
                                >
                                    Disable 2FA
                                </button>
                            )}
                        </div>
                        {uri && (
                            <form
                                onSubmit={confirmSubmit}
                                className="space-y-3 border-t border-gray-200 pt-4"
                            >
                                <p className="text-xs text-gray-500">
                                    Add this setup key in your authenticator,
                                    then enter its code. Setup expires after 10
                                    minutes.{" "}
                                    {admin.mfaEnabled &&
                                        "Keep the old authenticator until replacement is confirmed."}
                                </p>
                                <code className="block break-all rounded bg-gray-50 p-2 text-sm select-all">
                                    {new URL(uri).searchParams.get("secret")}
                                </code>
                                <a
                                    href={uri}
                                    className="block text-xs underline"
                                >
                                    Open authenticator app
                                </a>
                                <Field label="New authenticator code">
                                    <input
                                        name="code"
                                        required
                                        pattern="[0-9]{6}"
                                        maxLength={6}
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        className={fieldClass}
                                    />
                                </Field>
                                <button
                                    className={solidButtonClass}
                                    disabled={busy}
                                >
                                    Confirm 2FA
                                </button>
                                <button
                                    type="button"
                                    className={outlineButtonClass + " ml-2"}
                                    onClick={() => setUri("")}
                                >
                                    Cancel setup
                                </button>
                            </form>
                        )}
                    </div>
                </div>
                <div className={cardClass}>
                    <div className="flex flex-wrap gap-3 justify-between items-center mb-4">
                        <h2 className="text-sm font-semibold">
                            Active sessions
                        </h2>
                        <button
                            disabled={busy}
                            className={cn(
                                solidButtonClass,
                                "border-red-600 bg-red-600 text-white hover:bg-red-700 h-10 px-6",
                            )}
                            onClick={async () => {
                                setBusy(true);
                                setError("");

                                try {
                                    await signOut(true);
                                } catch (reason) {
                                    setError(errorMessage(reason));
                                } finally {
                                    setBusy(false);
                                }
                            }}
                        >
                            Sign out all devices
                        </button>
                    </div>
                    {state.loading || state.error ? (
                        <ApiState {...state} retry={state.reload} />
                    ) : (
                        <SessionTable
                            sessions={state.data.sessions ?? []}
                            busy={busy}
                            revoke={async (session) => {
                                setBusy(true);
                                setError("");

                                try {
                                    await revokeAdminSession(session.id);

                                    if (session.current) {
                                        endSession();
                                    }

                                    if (!session.current) {
                                        state.reload();
                                    }
                                } catch (reason) {
                                    setError(errorMessage(reason));
                                } finally {
                                    setBusy(false);
                                }
                            }}
                        />
                    )}
                </div>
                <div className={cardClass}>
                    <h2 className="text-sm font-semibold mb-4">
                        Security events
                    </h2>
                    {state.data.events.length ? (
                        <ul className="divide-y divide-gray-100">
                            {state.data.events.map((event) => (
                                <li
                                    key={event.id}
                                    className="py-3 flex flex-wrap justify-between gap-2 text-xs"
                                >
                                    <span>
                                        {event.action.replaceAll("_", " ")}
                                    </span>
                                    <span className="text-gray-500">
                                        {event.createdAt
                                            ? new Date(
                                                  event.createdAt,
                                              ).toLocaleString()
                                            : "-"}{" "}
                                        · {event.ip ?? "Unknown IP"}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500">
                            No events to display.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
