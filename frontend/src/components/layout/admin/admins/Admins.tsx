"use client";

import Link from "next/link";
import { LuPlus, LuShieldCheck } from "react-icons/lu";
import { solidButtonClass } from "@/constants/styles";
import { cn } from "@/lib/utils";
import { AdminsProps } from "./Admins.interfaces";

import { useAdminSession } from "../auth/AdminSessionProvider";
import ResourceTable from "@/components/ui/admin/resourceTable/ResourceTable";
import { StatusBadge } from "@/components/ui/admin/apiState/ApiState";

export default function Admins({ initialData }: Readonly<AdminsProps>) {
    const { admin, can } = useAdminSession();

    return (
        <ResourceTable
            title="Roles & Permissions"
            initialData={initialData}
            statuses={["active", "inactive"]}
            actions={
                admin.role === "super_admin" &&
                can("admins.manage") && (
                    <Link
                        href="/admin/roles/new"
                        className={cn(
                            solidButtonClass,
                            "h-9 px-6 md:text-sm gap-1.5",
                        )}
                    >
                        <LuPlus size={13} /> Add administrator
                    </Link>
                )
            }
            columns={[
                {
                    title: "Administrator",
                    cell: (adminAccount) => (
                        <Link
                            href={"/admin/roles/" + adminAccount.id}
                            className="font-medium hover:underline"
                        >
                            {adminAccount.fullName}
                        </Link>
                    ),
                },
                { title: "Email", cell: (adminAccount) => adminAccount.email },
                { title: "Role", cell: (adminAccount) => adminAccount.role },
                {
                    title: "Status",
                    cell: (adminAccount) => (
                        <StatusBadge>
                            {adminAccount.isActive ? "Active" : "Inactive"}
                        </StatusBadge>
                    ),
                },
                {
                    title: "MFA",
                    cell: (adminAccount) =>
                        adminAccount.mfaEnabled ? "Enabled" : "Not enabled",
                },
                {
                    title: "Actions",
                    cell: (adminAccount) => (
                        <div className="flex items-center gap-1 md:opacity-0 md:transition-opacity md:group-hover:opacity-100 md:focus-within:opacity-100">
                            <Link
                                className="inline-flex items-center justify-center rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400"
                                href={"/admin/roles/" + adminAccount.id}
                                title="Permissions & sessions"
                            >
                                <LuShieldCheck size={13} />
                            </Link>
                        </div>
                    ),
                },
            ]}
        />
    );
}
