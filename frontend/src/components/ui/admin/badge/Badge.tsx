"use client";

import { cn } from "@/lib/utils";
import { BadgeProps } from "./Badge.interfaces";

const styles: Record<string, string> = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    published: "bg-emerald-50 text-emerald-700 border-emerald-200",
    ok: "bg-emerald-50 text-emerald-700 border-emerald-200",
    low_stock: "bg-amber-50 text-amber-700 border-amber-200",
    low: "bg-amber-50 text-amber-700 border-amber-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    out_of_stock: "bg-red-50 text-red-700 border-red-200",
    out: "bg-red-50 text-red-700 border-red-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
    draft: "bg-gray-100 text-gray-500 border-gray-200",
    inactive: "bg-gray-100 text-gray-500 border-gray-200",
    public: "bg-gray-50 text-gray-600 border-gray-200",
    shipping: "bg-teal-50 text-teal-700 border-teal-200",
    visible: "bg-emerald-50 text-emerald-700 border-emerald-200",
    hidden: "bg-gray-100 text-gray-500 border-gray-200",
};

const labels: Record<string, string> = {
    active: "Active",
    published: "Published",
    ok: "In Stock",
    low_stock: "Low Stock",
    low: "Low",
    pending: "Pending",
    out_of_stock: "Out of Stock",
    out: "Out of Stock",
    draft: "Draft",
    inactive: "Inactive",
    public: "Public",
    shipping: "Free Ship",
    visible: "Visible",
    hidden: "Hidden",
};

export default function Badge({ label, variant }: Readonly<BadgeProps>) {
    return (
        <span
            className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border tracking-wide",
                styles[variant] || "bg-gray-100 text-gray-600 border-gray-200",
            )}
        >
            {labels[label] || label}
        </span>
    );
}
