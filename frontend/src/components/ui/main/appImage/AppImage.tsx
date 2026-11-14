import { memo } from "react";
import Image from "next/image";
import { getAppMedia } from "@/lib/utils";
import { AppImageProps } from "./AppImage.interfaces";
import { twMerge } from "tailwind-merge";

const AppImage = memo(function AppImage({
    src,
    alt,
    height,
    width,
    className,
    priority,
    fill = false,
}: Readonly<AppImageProps>) {
    const imageUrl = getAppMedia(src);

    if (!imageUrl) {
        return null;
    }

    return (
        <Image
            src={imageUrl}
            alt={alt}
            height={height}
            width={width}
            className={twMerge(`w-auto h-auto ${className}`)}
            priority={priority}
            fill={fill}
        />
    );
});

export default AppImage;
