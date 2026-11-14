"use client";

import { ChartTooltipProps } from "./ChartTooltip.interfaces";

export default function ChartTooltip({
    active,
    payload,
    label,
}: Readonly<ChartTooltipProps>) {
    if (!active || !payload || !payload.length) {
        return null;
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-3 py-2 text-xs">
            <p className="font-medium text-black mb-1">{label}</p>
            {payload.map((payloadItem, i) => {
                const { color, name = "", value = "" } = payloadItem;

                return (
                    <p
                        key={i}
                        style={{ color }}
                        className="flex items-center gap-2"
                    >
                        <span
                            className="w-1.5 h-1.5 rounded-full inline-block"
                            style={{ background: color }}
                        />
                        {name}:{" "}
                        <span className="font-medium ml-1">
                            {typeof value === "number" &&
                            name.toLowerCase().includes("rev")
                                ? `$${value.toLocaleString()}`
                                : value.toLocaleString()}
                        </span>
                    </p>
                );
            })}
        </div>
    );
}
