import { memo } from "react";
import Link from "next/link";
import { LogoProps } from "./Logo.interfaces";

import AppImage from "../appImage/AppImage";

const Logo = memo(function Logo({
    width,
    height,
    link,
    src,
    alt,
}: Readonly<LogoProps>) {
    return (
        <Link
            href={link ?? ""}
            className="inline-flex shrink-0"
            style={{ width: Number(width) }}
        >
            <AppImage
                src={src}
                alt={alt ?? "logo"}
                priority
                width={width}
                height={height}
                className="w-full h-auto object-contain"
            />
        </Link>
    );
});

export default Logo;
