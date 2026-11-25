"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    cardClass,
    outlineButtonClass,
    solidButtonClass,
} from "@/constants/styles";
import { deleteCustomer, updateCustomer } from "@/data/admin/actions/client";
import { useServerData } from "@/data/admin/useServerData";
import { errorMessage } from "@/data/admin/services/errors";
import { cn } from "@/lib/utils";
import { CustomerDetailProps } from "./CustomerDetail.interfaces";

import { useAdminSession } from "../../auth/AdminSessionProvider";
import { ApiState, StatusBadge } from "@/components/ui/admin/apiState/ApiState";
import TopBar from "@/components/ui/admin/topBar/TopBar";

export default function CustomerDetail({
    id,
    initialData,
}: Readonly<CustomerDetailProps>) {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const state = useServerData(initialData);
    const { can, confirmAction } = useAdminSession();

    if (state.loading || state.error || !state.data) {
        return <ApiState {...state} retry={state.reload} />;
    }

    const user = state.data;

    return (
        <div className="flex-1 overflow-y-auto">
            <TopBar
                title={user.username}
                crumbs={[
                    { label: "Dashboard", href: "/admin/dashboard" },
                    { label: "Customers", href: "/admin/customers" },
                    {
                        label: "Details",
                    },
                ]}
                actions={
                    <Link
                        href="/admin/customers"
                        className={cn(
                            outlineButtonClass,
                            "h-9 px-6 md:text-sm gap-1.5",
                        )}
                    >
                        Back
                    </Link>
                }
            />
            <div className="p-6">
                <div className={cardClass + " space-y-5"}>
                    <div className="space-y-1">
                        <h2 className="break-all text-lg font-semibold text-gray-900">
                            {user.email}
                        </h2>
                        <p className="text-sm text-gray-500">
                            Joined{" "}
                            {user.createdAt
                                ? new Date(user.createdAt).toLocaleString()
                                : "-"}{" "}
                            · {user.ordersCount} orders
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <StatusBadge>
                            {user.blocked ? "Blocked" : "Active"}
                        </StatusBadge>
                        <span className="text-sm text-gray-500">
                            Email {user.confirmed ? "confirmed" : "unconfirmed"}
                        </span>
                    </div>
                    {(can("users.update") || can("users.delete")) && (
                        <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-5">
                            {can("users.update") && (
                                <button
                                    disabled={busy}
                                    className={cn(
                                        outlineButtonClass,
                                        "h-9 px-4 md:text-sm disabled:cursor-not-allowed disabled:opacity-50",
                                    )}
                                    onClick={async () => {
                                        setBusy(true);
                                        setError("");

                                        try {
                                            await updateCustomer(
                                                id,
                                                !user.blocked,
                                            );

                                            state.reload();
                                        } catch (reason) {
                                            setError(errorMessage(reason));
                                        } finally {
                                            setBusy(false);
                                        }
                                    }}
                                >
                                    {user.blocked
                                        ? "Unblock customer"
                                        : "Block customer"}
                                </button>
                            )}
                            {can("users.delete") && (
                                <button
                                    disabled={busy}
                                    className={cn(
                                        solidButtonClass,
                                        "h-9 border-red-600 bg-red-600 px-4 text-white hover:border-red-700 hover:bg-red-700 focus-visible:ring-red-300 md:text-sm disabled:cursor-not-allowed disabled:opacity-50",
                                    )}
                                    onClick={async () => {
                                        if (
                                            await confirmAction(
                                                "Delete this customer?",
                                                (credentials) =>
                                                    deleteCustomer(
                                                        id,
                                                        credentials,
                                                    ),
                                            )
                                        )
                                            router.replace("/admin/customers");
                                    }}
                                >
                                    Delete customer
                                </button>
                            )}
                        </div>
                    )}
                    {error && <p className="text-sm text-red-600">{error}</p>}
                </div>
            </div>
        </div>
    );
}
