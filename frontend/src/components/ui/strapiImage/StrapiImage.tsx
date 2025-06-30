import { memo } from "react";
import Image from "next/image";
import { getStrapiMedia } from "@/lib/utils";
import { StrapiImageProps } from "./StrapiImage.interfaces";
import { twMerge } from "tailwind-merge";

const StrapiImage = memo(function StrapiImage({
    src,
    alt,
    height,
    width,
    className,
    priority,
    fill = false,
}: Readonly<StrapiImageProps>) {
    const imageUrl = getStrapiMedia(src);

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

export default StrapiImage;
