"use client";

import { useState } from "react";
import { LuImage } from "react-icons/lu";
import { cn } from "@/lib/utils";
import { ProductThumbProps } from "./ProductThumb.interfaces";

import AppImage from "../appImage/AppImage";

export default function ProductThumb({
    src,
    alt = "",
    className,
}: Readonly<ProductThumbProps>) {
    const [failedSrc, setFailedSrc] = useState<string | null>(null);
    const showImage = Boolean(src) && failedSrc !== src;

    return (
        <div
            className={cn(
                "size-8 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100",
                className,
            )}
        >
            {showImage && src ? (
                <AppImage
                    src={src}
                    alt={alt}
                    loading="lazy"
                    decoding="async"
                    onError={() => setFailedSrc(src ?? null)}
                    className="h-full w-full object-scale-down"
                    width={50}
                    height={50}
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400">
                    <LuImage size={14} />
                </div>
            )}
        </div>
    );
}
