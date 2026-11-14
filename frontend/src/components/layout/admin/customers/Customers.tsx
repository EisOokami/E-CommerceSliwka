"use client";

import Link from "next/link";
import { CustomersProps } from "./Customers.interfaces";

import ResourceTable from "@/components/ui/admin/resourceTable/ResourceTable";
import { StatusBadge } from "@/components/ui/admin/apiState/ApiState";
import { Avatar } from "@/components/ui/admin/avatar/Avatar";

export default function Customers({ initialData }: Readonly<CustomersProps>) {
    return (
        <ResourceTable
            title="Customers"
            initialData={initialData}
            statuses={["active", "blocked"]}
            columns={[
                {
                    title: "Customer",
                    cell: (user) => (
                        <Link
                            className="group flex items-center gap-3 font-medium"
                            href={"/admin/customers/" + user.id}
                        >
                            <Avatar
                                name={user.username}
                                src={user.avatar?.fileUrl}
                            />
                            <span className="group-hover:underline">
                                {user.username}
                            </span>
                        </Link>
                    ),
                },
                { title: "Email", cell: (user) => user.email },
                { title: "Orders", cell: (user) => user.ordersCount },
                {
                    title: "Status",
                    cell: (user) => (
                        <StatusBadge>
                            {user.blocked ? "Blocked" : "Active"}
                        </StatusBadge>
                    ),
                },
                {
                    title: "Joined",
                    cell: (user) =>
                        user.createdAt
                            ? new Date(user.createdAt).toLocaleString()
                            : "-",
                },
            ]}
        />
    );
}
