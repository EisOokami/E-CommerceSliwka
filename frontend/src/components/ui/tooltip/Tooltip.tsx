"use client";

import { useState } from "react";
import { TooltipProps } from "./Tooltip.interfaces";

export default function Tooltip({ message, children }: Readonly<TooltipProps>) {
    const [show, setShow] = useState(false);

    return (
        <div className="relative flex flex-col items-center group">
            <span
                className="flex justify-center"
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
                onFocus={() => setShow(true)}
                onBlur={() => setShow(false)}
            >
                {children}
            </span>
            <div
                className={`absolute top-full flex flex-col items-center group-hover:flex mt-1 whitespace-nowrap capitalize transition-all duration-200 ease-out ${
                    !show
                        ? "hidden opacity-0 scale-90"
                        : "opacity-100 scale-100"
                }`}
            >
                <div className="w-3 h-3 -mb-2.5 bg-gray-600 rotate-45" />
                <span className="relative p-2 text-xs text-white whitespace-no-wrap leading-none bg-gray-600 rounded-md shadow-lg z-10">
                    {message}
                </span>
            </div>
        </div>
    );
}
