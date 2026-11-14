"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
    LuChevronLeft,
    LuChevronRight,
    LuFilter,
    LuRefreshCw,
    LuSearch,
    LuSlidersHorizontal,
} from "react-icons/lu";
import { cn, getPageItems } from "@/lib/utils";

import TopBar from "../topBar/TopBar";
import { ApiState } from "../apiState/ApiState";
import { ResourceTableProps } from "./ResourceTable.interfaces";

export default function ResourceTable<T extends { id: string }>({
    title,
    columns,
    initialData,
    statuses = [],
    actions,
    priceSort = false,
}: Readonly<ResourceTableProps<T>>) {
    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();
    const urlSearch = params.get("search") ?? "";
    const [search, setSearch] = useState(urlSearch);
    const [pending, startTransition] = useTransition();
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        setSearch(urlSearch);

        if (timer.current) {
            clearTimeout(timer.current);
        }

        return () => {
            if (timer.current) {
                clearTimeout(timer.current);
            }
        };
    }, [urlSearch, params]);

    const status = params.get("status") ?? "";
    const sort =
        (params.get("sort") ?? "createdAt") +
        ":" +
        (params.get("direction") ?? "desc");
    const page = initialData.page;
    const totalPages = Math.max(
        1,
        Math.ceil(initialData.total / initialData.pageSize),
    );

    function navigate(values: Record<string, string>) {
        const next = new URLSearchParams(params.toString());

        Object.entries(values).forEach(([key, value]) => {
            if (value) {
                next.set(key, value);
            }

            if (!value) {
                next.delete(key);
            }
        });

        startTransition(() =>
            router.push(pathname + "?" + next.toString(), { scroll: false }),
        );
    }

    const state = {
        data: initialData,
        loading: pending,
        error: "",
        reload: () => startTransition(() => router.refresh()),
    };

    const rows = state.data.data ?? [];
    const total = state.data.total ?? 0;
    const label = title.toLowerCase();

    return (
        <div className="flex-1 overflow-y-auto">
            <TopBar
                title={title}
                crumbs={[
                    { label: "Dashboard", href: "/admin/dashboard" },
                    {
                        label: title,
                    },
                ]}
                actions={actions}
            />
            <div className="p-6">
                <div className="bg-white border border-gray-200 rounded-lg">
                    <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-gray-200">
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="relative w-full sm:w-auto">
                                <LuSearch
                                    size={12}
                                    className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    placeholder={"Search " + label + "..."}
                                    className="h-8 rounded-md border border-gray-200 bg-white text-xs text-gray-700 transition-colors focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:opacity-50 w-full pl-8 pr-3 placeholder:text-gray-400 sm:w-64"
                                    value={search}
                                    onChange={(event) => {
                                        const value = event.target.value;

                                        setSearch(value);

                                        if (timer.current) {
                                            clearTimeout(timer.current);
                                        }

                                        timer.current = setTimeout(
                                            () =>
                                                navigate({
                                                    search: value,
                                                    page: "1",
                                                }),
                                            300,
                                        );
                                    }}
                                />
                            </div>
                            {statuses.length > 0 && (
                                <div className="relative">
                                    <LuFilter
                                        size={12}
                                        className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500"
                                    />
                                    <select
                                        className="h-8 rounded-md border border-gray-200 bg-white text-xs text-gray-700 transition-colors focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:opacity-50 cursor-pointer pl-7 pr-2 capitalize"
                                        value={status}
                                        disabled={pending}
                                        onChange={(event) => {
                                            navigate({
                                                status: event.target.value,
                                                page: "1",
                                            });
                                        }}
                                    >
                                        <option value="">All statuses</option>
                                        {statuses.map((value) => (
                                            <option
                                                key={value}
                                                className="capitalize"
                                            >
                                                {value}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            <div className="relative">
                                <LuSlidersHorizontal
                                    size={12}
                                    className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500"
                                />
                                <select
                                    className="h-8 rounded-md border border-gray-200 bg-white text-xs text-gray-700 transition-colors focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:opacity-50 cursor-pointer pl-7 pr-2"
                                    value={sort}
                                    disabled={pending}
                                    onChange={(event) => {
                                        const [sort, direction] =
                                            event.target.value.split(":");

                                        navigate({
                                            sort,
                                            direction,
                                            page: "1",
                                        });
                                    }}
                                >
                                    <option value="createdAt:desc">
                                        Newest first
                                    </option>
                                    <option value="createdAt:asc">
                                        Oldest first
                                    </option>
                                    <option value="name:asc">Name A-Z</option>
                                    {priceSort && (
                                        <>
                                            <option value="price:asc">
                                                Price: low to high
                                            </option>
                                            <option value="price:desc">
                                                Price: high to low
                                            </option>
                                        </>
                                    )}
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                                {total} {label}
                            </span>
                            <button
                                type="button"
                                className="flex h-8 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 text-xs text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 disabled:opacity-50"
                                onClick={state.reload}
                                disabled={state.loading}
                            >
                                <LuRefreshCw size={12} />
                                Refresh
                            </button>
                        </div>
                    </div>
                    {state.loading || state.error ? (
                        <ApiState {...state} retry={state.reload} />
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            {columns.map((column) => (
                                                <th
                                                    key={column.title}
                                                    scope="col"
                                                    className="whitespace-nowrap px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500"
                                                >
                                                    {column.title}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {rows.map((row) => (
                                            <tr
                                                key={row.id}
                                                className="group transition-colors hover:bg-neutral-50"
                                            >
                                                {columns.map((column) => (
                                                    <td
                                                        key={column.title}
                                                        className="px-4 py-3 text-gray-700"
                                                    >
                                                        {column.cell(
                                                            row,
                                                            state.reload,
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                        {!rows.length && (
                                            <tr>
                                                <td
                                                    colSpan={columns.length}
                                                    className="px-4 py-12 text-center text-sm text-gray-400"
                                                >
                                                    No results found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 px-4 py-3">
                                <p className="text-xs text-gray-500">
                                    Showing {rows.length} of {total} {label}
                                </p>
                                <nav className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        className="flex size-7 items-center justify-center rounded border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 disabled:opacity-40 disabled:hover:bg-transparent"
                                        disabled={pending || page <= 1}
                                        onClick={() =>
                                            navigate({ page: String(page - 1) })
                                        }
                                    >
                                        <LuChevronLeft size={13} />
                                    </button>
                                    {getPageItems(page, totalPages).map(
                                        (item) =>
                                            item.page === null ? (
                                                <span
                                                    key={item.key}
                                                    className="px-1 text-xs text-gray-400"
                                                >
                                                    ...
                                                </span>
                                            ) : (
                                                <button
                                                    key={item.key}
                                                    type="button"
                                                    disabled={pending}
                                                    className={cn(
                                                        "flex h-7 min-w-7 items-center justify-center rounded px-2 text-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400",
                                                        item.page === page
                                                            ? "bg-gray-900 font-medium text-white"
                                                            : "border border-gray-200 text-gray-700 hover:bg-gray-50",
                                                    )}
                                                    onClick={() => {
                                                        if (
                                                            item.page !== page
                                                        ) {
                                                            navigate({
                                                                page: String(
                                                                    item.page,
                                                                ),
                                                            });
                                                        }
                                                    }}
                                                >
                                                    {item.page}
                                                </button>
                                            ),
                                    )}
                                    <button
                                        type="button"
                                        className="flex size-7 items-center justify-center rounded border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 disabled:opacity-40 disabled:hover:bg-transparent"
                                        disabled={pending || page >= totalPages}
                                        onClick={() =>
                                            navigate({ page: String(page + 1) })
                                        }
                                    >
                                        <LuChevronRight size={13} />
                                    </button>
                                </nav>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
