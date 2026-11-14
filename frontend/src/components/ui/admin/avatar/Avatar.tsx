"use client";

import { useState } from "react";
import { getInitials, hash } from "@/lib/utils";
import { AvatarProps } from "./Avatar.interfaces";

import AppImage from "../appImage/AppImage";

const palette = [
    "bg-rose-100 text-rose-700",
    "bg-amber-100 text-amber-700",
    "bg-emerald-100 text-emerald-700",
    "bg-sky-100 text-sky-700",
    "bg-violet-100 text-violet-700",
    "bg-pink-100 text-pink-700",
];

const sizes = {
    sm: "size-8 text-xs",
    md: "size-10 text-sm",
    lg: "size-16 text-lg",
};

export function Avatar({ name, src, size = "sm" }: Readonly<AvatarProps>) {
    const [failedSrc, setFailedSrc] = useState<string | null>(null);

    const showImage = Boolean(src) && failedSrc !== src;
    const base = `${sizes[size]} shrink-0 rounded-full`;

    if (showImage) {
        return (
            <AppImage
                src={src!}
                alt={name}
                className={`${base} object-cover`}
                referrerPolicy="no-referrer"
                onError={() => setFailedSrc(src!)}
                width={100}
                height={100}
            />
        );
    }

    return (
        <span
            className={`${base} ${palette[hash(name) % palette.length]} inline-flex items-center justify-center font-medium`}
        >
            {getInitials(name)}
        </span>
    );
}
