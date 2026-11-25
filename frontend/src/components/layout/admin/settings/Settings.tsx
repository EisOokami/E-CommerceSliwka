"use client";

import { useState, type FormEvent } from "react";
import { saveSettings } from "@/data/admin/actions/client";
import { useServerData } from "@/data/admin/useServerData";
import { cardClass, fieldClass, solidButtonClass } from "@/constants/styles";
import { cn } from "@/lib/utils";
import { SettingsProps } from "./Settings.interfaces";

import { useAdminSession } from "../auth/AdminSessionProvider";
import TopBar from "@/components/ui/admin/topBar/TopBar";
import { ApiState, Field } from "@/components/ui/admin/apiState/ApiState";

export default function Settings({ initialData }: Readonly<SettingsProps>) {
    const [busy, setBusy] = useState(false);
    const [saved, setSaved] = useState(false);
    const state = useServerData(initialData);
    const { can, confirmAction } = useAdminSession();

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (busy) {
            return;
        }

        const data = new FormData(event.currentTarget);

        setBusy(true);
        setSaved(false);

        const success = await confirmAction(
            "Save store settings?",
            (credentials) =>
                saveSettings(
                    {
                        storeName: String(data.get("storeName")),
                        lowStockThreshold: Number(data.get("threshold")),
                    },
                    credentials,
                ),
        );

        setBusy(false);

        if (success) {
            setSaved(true);

            state.reload();
        }
    };

    return (
        <div className="flex-1 overflow-y-auto">
            <TopBar
                title="Settings"
                crumbs={[
                    { label: "Dashboard", href: "/admin/dashboard" },
                    {
                        label: "Settings",
                    },
                ]}
            />
            <div className="p-6 max-w-3xl">
                {saved && (
                    <p className="mb-3 text-sm text-emerald-700">
                        Settings saved.
                    </p>
                )}
                {state.loading || state.error || !state.data ? (
                    <ApiState {...state} retry={state.reload} />
                ) : (
                    <form
                        onSubmit={submit}
                        className={cardClass + " space-y-4"}
                    >
                        <h2 className="text-sm font-semibold">
                            Store settings
                        </h2>
                        <fieldset
                            className="space-y-4"
                            disabled={busy || !can("settings.update")}
                        >
                            <Field label="Store name">
                                <input
                                    name="storeName"
                                    required
                                    maxLength={100}
                                    defaultValue={state.data.storeName}
                                    className={fieldClass}
                                />
                            </Field>
                            <Field label="Low stock threshold">
                                <input
                                    name="threshold"
                                    type="number"
                                    required
                                    min={0}
                                    max={10000}
                                    step={1}
                                    defaultValue={state.data.lowStockThreshold}
                                    className={fieldClass}
                                />
                            </Field>
                            {can("settings.update") && (
                                <button
                                    className={cn(solidButtonClass, "h-9 px-6")}
                                >
                                    {busy ? "Saving..." : "Save changes"}
                                </button>
                            )}
                        </fieldset>
                    </form>
                )}
            </div>
        </div>
    );
}
