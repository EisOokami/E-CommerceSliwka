"use client";

import { useState } from "react";
import Link from "next/link";
import { updateOrder } from "@/data/admin/actions/client";
import { useServerData } from "@/data/admin/useServerData";
import { errorMessage } from "@/data/admin/services/client";
import { cardClass, fieldClass, outlineButtonClass } from "@/constants/styles";
import { cn, moneyLabel } from "@/lib/utils";
import { OrderStatus } from "@/interfaces/admin/api";
import { OrderDetailProps } from "./OrderDetail.interfaces";

import TopBar from "@/components/ui/admin/topBar/TopBar";
import { useAdminSession } from "../../auth/AdminSessionProvider";
import { ApiState, StatusBadge } from "@/components/ui/admin/apiState/ApiState";

const transitions: Record<OrderStatus, OrderStatus[]> = {
    Processing: ["Processing", "Shipped", "Cancelled"],
    Shipped: ["Shipped", "Delivered"],
    Delivered: ["Delivered"],
    Cancelled: ["Cancelled"],
};

export default function OrderDetail({
    id,
    initialData,
}: Readonly<OrderDetailProps>) {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const state = useServerData(initialData);
    const { can } = useAdminSession();

    if (state.loading || state.error || !state.data) {
        return <ApiState {...state} retry={state.reload} />;
    }

    const order = state.data;
    const available = (
        transitions[order.deliveryStatus] ?? ["Processing"]
    ).filter(
        (value) =>
            order.isSuccess ||
            value === "Cancelled" ||
            value === order.deliveryStatus,
    );

    return (
        <div className="flex-1 overflow-y-auto">
            <TopBar
                title={order.orderId}
                crumbs={[
                    { label: "Dashboard", href: "/admin/dashboard" },
                    {
                        label: "Orders",
                        href: "/admin/orders",
                    },
                    { label: "Details" },
                ]}
                actions={
                    <Link
                        href="/admin/orders"
                        className={cn(
                            outlineButtonClass,
                            "h-9 px-6 md:text-sm gap-1.5",
                        )}
                    >
                        Back to orders
                    </Link>
                }
            />
            <div className="p-6 space-y-4">
                <div className={cardClass + " grid gap-4 md:grid-cols-3"}>
                    <div className="text-sm">
                        <p className="text-gray-500">Customer</p>
                        <Link
                            href={"/admin/customers/" + order.userId}
                            className="underline"
                        >
                            {order.customer?.email ?? order.userId}
                        </Link>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="text-xl font-semibold">
                            {moneyLabel(order.totalMinor, order.currency)}
                        </p>
                    </div>
                    <div className="text-sm">
                        <p>
                            {order.createdAt
                                ? new Date(order.createdAt).toLocaleString()
                                : "-"}
                        </p>
                        <p>
                            {order.isSuccess ? "Paid" : "Unpaid"} ·{" "}
                            {order.trackingNumber ?? "No tracking number"}
                        </p>
                    </div>
                </div>
                <div className={cardClass}>
                    <h2 className="text-sm font-semibold mb-3">
                        Delivery status
                    </h2>
                    {can("orders.update") ? (
                        <select
                            disabled={busy}
                            value={order.deliveryStatus}
                            className={cn(
                                fieldClass,
                                `appearance-none max-w-xs pr-11 bg-no-repeat bg-[position:right_1rem_center] bg-[length:1.25rem] bg-[url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2020%2020'%3E%3Cpath%20fill='none'%20stroke='%236b7280'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke-width='1.5'%20d='M6%208l4%204%204-4'/%3E%3C/svg%3E")]`,
                            )}
                            onChange={async (event) => {
                                setBusy(true);
                                setError("");

                                try {
                                    await updateOrder(
                                        id,
                                        event.target.value as OrderStatus,
                                    );

                                    state.reload();
                                } catch (reason) {
                                    setError(errorMessage(reason));
                                } finally {
                                    setBusy(false);
                                }
                            }}
                        >
                            {available.map((value) => (
                                <option key={value}>{value}</option>
                            ))}
                        </select>
                    ) : (
                        <StatusBadge>{order.deliveryStatus}</StatusBadge>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                        Cancelling delivery does not issue a payment refund.
                    </p>
                    {error && (
                        <p className="mt-2 text-sm text-red-600">{error}</p>
                    )}
                </div>
                <div className={cardClass}>
                    <h2 className="mb-3 text-sm font-semibold">Order items</h2>
                    {order.cartItems.length ? (
                        <ul className="space-y-2 text-sm">
                            {order.cartItems.map((item, index) => (
                                <li key={item.id ?? index}>
                                    <Link
                                        className="underline"
                                        href={
                                            "/admin/products/" + item.product.id
                                        }
                                    >
                                        {item.product.id}
                                    </Link>{" "}
                                    x {item.quantity}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500">
                            No item details recorded.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
