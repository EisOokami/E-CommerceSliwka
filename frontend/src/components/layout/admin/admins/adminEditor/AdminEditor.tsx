"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    cardClass,
    fieldClass,
    outlineButtonClass,
    solidButtonClass,
} from "@/constants/styles";
import { useServerData } from "@/data/admin/useServerData";
import {
    saveAdmin,
    deleteAdmin,
    revokeManagedSession,
} from "@/data/admin/actions/client";
import { cn, permissionLabel } from "@/lib/utils";
import {
    AdminAccount,
    permissions,
    type AdminInput,
} from "@/interfaces/admin/api";
import { AdminEditorProps } from "./AdminEditor.interface";

import { useAdminSession } from "../../auth/AdminSessionProvider";
import { Field } from "@/components/ui/admin/apiState/ApiState";
import SessionTable from "@/components/ui/admin/sessionTable/SessionTable";
import TopBar from "@/components/ui/admin/topBar/TopBar";

const permissionGroups = permissions.reduce<Record<string, string[]>>(
    (groups, permission) => {
        const section = permission.split(".")[0] || "other";

        (groups[section] ??= []).push(permission);

        return groups;
    },
    {},
);

export default function AdminEditor({
    id,
    initialData,
}: Readonly<AdminEditorProps>) {
    const state = useServerData<Partial<AdminAccount>>(initialData ?? {});

    const [busy, setBusy] = useState(false);
    const [selected, setSelected] = useState<string[]>(
        state.data.permissions ?? [],
    );
    const { admin, can, confirmAction } = useAdminSession();
    const router = useRouter();

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (
            busy ||
            !(
                can("admins.manage") &&
                admin.role === "super_admin" &&
                state.data.role !== "super_admin"
            )
        ) {
            return;
        }

        const form = event.currentTarget;
        const values = new FormData(form);

        setBusy(true);

        const input: AdminInput = {
            fullName: String(values.get("fullName")),
            role: String(values.get("role")) as AdminInput["role"],
            isActive: id ? values.get("isActive") === "on" : true,
            permissions: selected,
            ...(!id
                ? {
                      email: String(values.get("email")),
                      password: String(values.get("password")),
                  }
                : {}),
        };

        const success = await confirmAction(
            id
                ? "Save permissions and revoke this admin's sessions?"
                : "Create administrator?",
            (credentials) => saveAdmin(input, credentials, id),
        );

        setBusy(false);

        if (success) {
            form.reset();

            router.push("/admin/roles");
            router.refresh();
        }
    };

    return (
        <div className="flex-1 overflow-y-auto">
            <TopBar
                title={state.data.fullName ?? "Create administrator"}
                crumbs={[
                    { label: "Dashboard", href: "/admin/dashboard" },
                    { label: "Roles & Permissions", href: "/admin/roles" },
                    { label: state.data.fullName ?? "Create administrator" },
                ]}
                actions={
                    <Link
                        href="/admin/roles"
                        className={cn(
                            outlineButtonClass,
                            "h-9 px-6 md:text-sm gap-1.5",
                        )}
                    >
                        Back
                    </Link>
                }
            />
            <div className="p-6 space-y-4">
                <form onSubmit={submit} className={cardClass + " space-y-4"}>
                    <fieldset
                        disabled={
                            !(
                                can("admins.manage") &&
                                admin.role === "super_admin" &&
                                state.data.role !== "super_admin"
                            ) || busy
                        }
                        className="space-y-4"
                    >
                        <div className="grid md:grid-cols-2 gap-4">
                            <Field label="Full name">
                                <input
                                    name="fullName"
                                    defaultValue={state.data.fullName}
                                    required
                                    maxLength={255}
                                    className={fieldClass}
                                />
                            </Field>
                            <Field label="Email">
                                <input
                                    name="email"
                                    type="email"
                                    defaultValue={state.data.email}
                                    readOnly={!!id}
                                    required
                                    maxLength={255}
                                    className={fieldClass}
                                />
                            </Field>
                            {!id && (
                                <Field label="Initial password">
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        minLength={12}
                                        maxLength={255}
                                        autoComplete="new-password"
                                        className={fieldClass}
                                    />
                                </Field>
                            )}
                            <Field label="Role">
                                <select
                                    name="role"
                                    defaultValue={state.data.role ?? "admin"}
                                    className={fieldClass}
                                >
                                    {state.data.role === "super_admin" && (
                                        <option>super_admin</option>
                                    )}
                                    {["admin", "manager", "support"].map(
                                        (role) => (
                                            <option key={role}>{role}</option>
                                        ),
                                    )}
                                </select>
                            </Field>
                        </div>
                        {id && (
                            <label className="flex gap-2 text-sm">
                                <input
                                    name="isActive"
                                    type="checkbox"
                                    defaultChecked={state.data.isActive ?? true}
                                />
                                Active account
                            </label>
                        )}
                        <section className="space-y-1">
                            <div className="border-b border-gray-200 pb-3">
                                <h2
                                    id="permissions-heading"
                                    className="text-sm font-semibold text-gray-900"
                                >
                                    Permissions
                                </h2>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {Object.entries(permissionGroups).map(
                                    ([section, items]) => (
                                        <div
                                            key={section}
                                            className="grid gap-3 py-4 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-5"
                                        >
                                            <h3 className="text-sm font-medium text-gray-800">
                                                {permissionLabel(section)}
                                            </h3>
                                            <div className="grid min-w-0 gap-x-5 gap-y-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                                {items.map((permission) => (
                                                    <label
                                                        key={permission}
                                                        className="flex min-w-0 cursor-pointer items-center gap-2.5 text-sm text-gray-700"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            className="size-3.5 shrink-0 cursor-pointer rounded border-gray-300 accent-gray-900 disabled:cursor-not-allowed"
                                                            checked={
                                                                state.data
                                                                    .role ===
                                                                    "super_admin" ||
                                                                selected.includes(
                                                                    permission,
                                                                )
                                                            }
                                                            onChange={(event) =>
                                                                setSelected(
                                                                    (
                                                                        current,
                                                                    ) =>
                                                                        event
                                                                            .target
                                                                            .checked
                                                                            ? [
                                                                                  ...current,
                                                                                  permission,
                                                                              ]
                                                                            : current.filter(
                                                                                  (
                                                                                      value,
                                                                                  ) =>
                                                                                      value !==
                                                                                      permission,
                                                                              ),
                                                                )
                                                            }
                                                        />
                                                        <span className="min-w-0 break-words">
                                                            {permissionLabel(
                                                                permission
                                                                    .split(".")
                                                                    .slice(1)
                                                                    .join(
                                                                        ".",
                                                                    ) ||
                                                                    permission,
                                                            )}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        </section>
                    </fieldset>
                    <p className="text-xs text-gray-500">
                        MFA: {state.data.mfaEnabled ? "enabled" : "not enabled"}
                        . Updating access signs this administrator out on all
                        devices.
                    </p>
                    {can("admins.manage") &&
                        admin.role === "super_admin" &&
                        state.data.role !== "super_admin" && (
                            <div className="flex gap-2">
                                <button
                                    className={solidButtonClass}
                                    disabled={busy}
                                >
                                    {busy
                                        ? "Please wait..."
                                        : "Save administrator"}
                                </button>
                                {id && (
                                    <button
                                        type="button"
                                        className={
                                            outlineButtonClass + " text-red-600"
                                        }
                                        onClick={async () => {
                                            if (
                                                await confirmAction(
                                                    "Delete this administrator?",
                                                    (credentials) =>
                                                        deleteAdmin(
                                                            id,
                                                            credentials,
                                                        ),
                                                )
                                            )
                                                router.push("/admin/roles");
                                            router.refresh();
                                        }}
                                    >
                                        Delete administrator
                                    </button>
                                )}
                            </div>
                        )}
                </form>
                {id && (
                    <div className={cardClass}>
                        <h2 className="text-sm font-semibold mb-3">
                            Active sessions
                        </h2>
                        <SessionTable
                            sessions={state.data.sessions ?? []}
                            revoke={
                                can("admins.manage") &&
                                admin.role === "super_admin" &&
                                state.data.role !== "super_admin"
                                    ? async (session) => {
                                          if (
                                              await confirmAction(
                                                  "Revoke this session?",
                                                  (credentials) =>
                                                      revokeManagedSession(
                                                          id,
                                                          session.id,
                                                          credentials,
                                                      ),
                                              )
                                          )
                                              state.reload();
                                      }
                                    : undefined
                            }
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
