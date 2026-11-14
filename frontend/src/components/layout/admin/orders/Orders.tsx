"use client";

import Link from "next/link";
import { moneyLabel } from "@/lib/utils";
import { OrdersProps } from "./Orders.interfaces";

import ResourceTable from "@/components/ui/admin/resourceTable/ResourceTable";
import { StatusBadge } from "@/components/ui/admin/apiState/ApiState";

export default function Orders({ initialData }: Readonly<OrdersProps>) {
    return (
        <ResourceTable
            title="Orders"
            initialData={initialData}
            statuses={["Processing", "Shipped", "Delivered", "Cancelled"]}
            columns={[
                {
                    title: "Order",
                    cell: (order) => (
                        <Link
                            className="font-medium hover:underline"
                            href={"/admin/orders/" + order.id}
                        >
                            {order.orderId}
                        </Link>
                    ),
                },
                {
                    title: "Customer",
                    cell: (order) => order.customerEmail ?? order.userId,
                },
                {
                    title: "Total",
                    cell: (order) =>
                        moneyLabel(order.totalMinor, order.currency),
                },
                {
                    title: "Status",
                    cell: (order) => (
                        <StatusBadge>{order.deliveryStatus}</StatusBadge>
                    ),
                },
                {
                    title: "Payment",
                    cell: (order) => (order.isSuccess ? "Paid" : "Unpaid"),
                },
                {
                    title: "Date",
                    cell: (order) =>
                        order.createdAt
                            ? new Date(order.createdAt).toLocaleString()
                            : "-",
                },
            ]}
        />
    );
}
