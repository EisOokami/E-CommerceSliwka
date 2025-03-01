import Link from "next/link";
import { LogoProps } from "./Logo.interfaces";
import StrapiImage from "../strapiImage/StrapiImage";

export default function Logo({ width, height, link, src, alt }: LogoProps) {
    return (
        <Link href={link ?? ""}>
            <StrapiImage
                src={src}
                alt={alt ?? "logo"}
                priority
                width={width}
                height={height}
            />
        </Link>
    );
}
