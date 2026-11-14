"use client";

import { cn } from "@/lib/utils";
import { LuTrendingDown, LuTrendingUp } from "react-icons/lu";
import { StatCardProps } from "./StatCard.interfaces";

export default function StatCard({
    label,
    value,
    sub,
    trend,
    trendUp,
}: Readonly<StatCardProps>) {
    return (
        <div className="min-w-0 break-words bg-white border border-gray-200 rounded-lg p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                {label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-black tracking-tight">
                {value}
            </p>
            {(trend || sub) && (
                <div className="mt-1.5 flex items-center gap-1.5">
                    {trend && (
                        <span
                            className={cn(
                                "flex items-center gap-0.5 text-xs font-medium",
                                trendUp ? "text-emerald-600" : "text-red-500",
                            )}
                        >
                            {trendUp ? (
                                <LuTrendingUp size={12} />
                            ) : (
                                <LuTrendingDown size={12} />
                            )}
                            {trend}
                        </span>
                    )}
                    {sub && (
                        <span className="text-xs text-gray-500">{sub}</span>
                    )}
                </div>
            )}
        </div>
    );
}
