"use client";

import { useState } from "react";
import Link from "next/link";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import {
    LuArrowUpRight,
    LuCalendar,
    LuRefreshCw,
    LuTriangleAlert,
} from "react-icons/lu";
import { useServerData } from "@/data/admin/useServerData";
import { cn, moneyLabel } from "@/lib/utils";
import { solidButtonClass } from "@/constants/styles";
import { DashboardProps } from "./Dashboard.interfaces";

import TopBar from "@/components/ui/admin/topBar/TopBar";
import StatCard from "@/components/ui/admin/statCard/StatCard";
import { ApiState, StatusBadge } from "@/components/ui/admin/apiState/ApiState";

export default function Dashboard({ initialData }: Readonly<DashboardProps>) {
    const [selectedCurrency, setCurrency] = useState("");
    const state = useServerData(initialData);

    if (state.loading || state.error || !state.data) {
        return <ApiState {...state} retry={state.reload} />;
    }

    const data = state.data;
    const currencies = data.revenue.flatMap((row) =>
        row.currency ? [row.currency] : [],
    );
    const currency = currencies.includes(selectedCurrency)
        ? selectedCurrency
        : (currencies[0] ?? "");
    const revenue = data.revenue.find((row) => row.currency === currency);
    const chart = data.chart
        .filter((row) => row.currency === currency && row.totalMinor !== null)
        .map((row) => ({ date: row.date, totalMinor: Number(row.totalMinor) }));
    const chartSubtitle = currency ? `UTC · ${currency.toUpperCase()}` : "UTC";

    return (
        <div className="flex-1 overflow-y-auto">
            <TopBar
                title="Dashboard"
                crumbs={[{ label: "Dashboard" }]}
                actions={
                    <div className="flex items-center gap-2">
                        {currencies.length > 1 && (
                            <div className="inline-flex h-8 items-center rounded-md border border-gray-200 bg-white p-0.5">
                                {currencies.map((value) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => setCurrency(value)}
                                        className={cn(
                                            "h-full rounded px-2.5 text-xs font-medium transition-colors",
                                            value === currency
                                                ? "bg-gray-900 text-white"
                                                : "text-gray-500 hover:text-gray-900",
                                        )}
                                    >
                                        {value.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={state.reload}
                            className={cn(
                                solidButtonClass,
                                "h-9 px-6 md:text-sm gap-1.5",
                            )}
                        >
                            <LuRefreshCw size={12} />
                            Refresh
                        </button>
                    </div>
                }
            />
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    <StatCard
                        label="Total sales"
                        value={
                            revenue
                                ? moneyLabel(revenue.totalMinor, currency)
                                : "No recorded sales"
                        }
                        sub="Paid orders · last 30 days"
                    />
                    <StatCard label="Orders" value={String(data.orders)} />
                    <StatCard
                        label="Customers"
                        value={String(data.customers)}
                    />
                    <StatCard label="Products" value={String(data.products)} />
                </div>
                {data.missingTotals > 0 && (
                    <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                        {data.missingTotals} historical paid orders have no
                        recorded total and are excluded from sales amounts.
                    </p>
                )}
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">
                                Revenue Overview
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {chartSubtitle}
                            </p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 border border-gray-200 rounded-md px-2.5 py-1">
                            <LuCalendar size={11} />
                            Last 30 days
                        </div>
                    </div>
                    {chart.length ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <AreaChart
                                data={chart}
                                margin={{
                                    top: 4,
                                    right: 4,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <defs>
                                    <linearGradient
                                        id="revenueFill"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="0%"
                                            stopColor="#111827"
                                            stopOpacity={0.08}
                                        />
                                        <stop
                                            offset="100%"
                                            stopColor="#111827"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#F3F4F6"
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 11, fill: "#9CA3AF" }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 11, fill: "#9CA3AF" }}
                                    tickFormatter={(value) =>
                                        moneyLabel(value, currency)
                                    }
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    formatter={(value) =>
                                        moneyLabel(Number(value), currency)
                                    }
                                    contentStyle={{
                                        fontSize: 12,
                                        borderRadius: 6,
                                        border: "1px solid #E5E7EB",
                                        boxShadow: "none",
                                    }}
                                    cursor={{ stroke: "#E5E7EB" }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="totalMinor"
                                    name="Revenue"
                                    stroke="#111827"
                                    strokeWidth={1.5}
                                    fill="url(#revenueFill)"
                                    dot={false}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="flex h-[220px] items-center justify-center text-sm text-gray-400">
                            No sales recorded in this period.
                        </p>
                    )}
                </div>
                <div className="grid lg:grid-cols-3 gap-4">
                    <div className="bg-white border border-gray-200 rounded-lg lg:col-span-2">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-900">
                                Recent Orders
                            </h3>
                            <Link
                                href="/admin/orders"
                                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition-colors"
                            >
                                View all <LuArrowUpRight size={12} />
                            </Link>
                        </div>
                        {data.recentOrders.length ? (
                            <ul className="divide-y divide-gray-100">
                                {data.recentOrders.map((order) => (
                                    <li
                                        key={order.id}
                                        className="flex items-center gap-4 px-5 py-3 hover:bg-neutral-50 transition-colors"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <Link
                                                href={
                                                    "/admin/orders/" + order.id
                                                }
                                                className="block truncate text-xs font-medium text-gray-900 hover:underline"
                                            >
                                                {order.orderId}
                                            </Link>
                                        </div>
                                        <p className="shrink-0 text-right text-xs font-semibold text-gray-900">
                                            {moneyLabel(
                                                order.totalMinor,
                                                order.currency,
                                            )}
                                        </p>
                                        <StatusBadge>
                                            {order.deliveryStatus}
                                        </StatusBadge>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="py-8 text-center text-sm text-gray-400">
                                No orders yet.
                            </p>
                        )}
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-900">
                                Low Stock
                            </h3>
                            <LuTriangleAlert
                                size={13}
                                className="text-amber-500"
                            />
                        </div>
                        {data.lowStock.length ? (
                            <ul className="divide-y divide-gray-100">
                                {data.lowStock.map((product) => {
                                    const isOut = Number(product.quantity) <= 0;
                                    return (
                                        <li
                                            key={product.id}
                                            className="flex items-center gap-3 px-5 py-2.5"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <Link
                                                    href={
                                                        "/admin/products/" +
                                                        product.id
                                                    }
                                                    className="block truncate text-xs font-medium text-gray-900 hover:underline"
                                                >
                                                    {product.name}
                                                </Link>
                                                <p className="text-[10px] text-gray-500">
                                                    {product.quantity} left
                                                </p>
                                            </div>
                                            <span
                                                className={cn(
                                                    "text-[10px] font-semibold",
                                                    isOut
                                                        ? "text-red-500"
                                                        : "text-amber-500",
                                                )}
                                            >
                                                {isOut ? "Out" : "Low"}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p className="px-5 py-6 text-sm text-gray-500">
                                No low stock products.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
