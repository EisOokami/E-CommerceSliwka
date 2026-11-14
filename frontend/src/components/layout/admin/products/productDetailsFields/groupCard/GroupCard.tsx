"use client";

import { cn } from "@/lib/utils";
import { focusClass } from "@/constants/styles";
import { GroupCardProps } from "./GroupCard.interfaces";

export default function GroupCard({
    index,
    onRemove,
    children,
}: Readonly<GroupCardProps>) {
    return (
        <div className="space-y-5 rounded-xl border border-gray-200 bg-gray-50/60 p-4 sm:p-5">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Group #{index + 1}
                </span>
                <button
                    type="button"
                    className={cn(
                        focusClass,
                        "rounded-md px-2 py-1 text-sm text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600",
                    )}
                    onClick={onRemove}
                >
                    Remove group
                </button>
            </div>
            {children}
        </div>
    );
}
