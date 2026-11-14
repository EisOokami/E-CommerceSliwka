"use client";

import { LuPlus } from "react-icons/lu";
import { outlineButtonClass } from "@/constants/styles";
import { cn } from "@/lib/utils";
import { GroupSectionProps } from "./GroupSection.interfaces";

export default function GroupSection({
    title,
    addLabel,
    emptyText,
    count,
    onAdd,
    children,
}: Readonly<GroupSectionProps>) {
    return (
        <section className="space-y-4">
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-gray-200 bg-white py-3">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    {title}
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                        {count}
                    </span>
                </h3>
                <button
                    type="button"
                    className={cn(outlineButtonClass, "h-9 gap-1.5 px-4")}
                    onClick={onAdd}
                >
                    <LuPlus size={15} /> {addLabel}
                </button>
            </div>
            {count === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
                    {emptyText}
                </div>
            ) : (
                children
            )}
        </section>
    );
}
