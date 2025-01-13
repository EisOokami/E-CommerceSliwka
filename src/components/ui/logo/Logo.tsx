import Image from "next/image";
import Link from "next/link";
import { LogoProps } from "./Logo.interfaces";

export default function Logo({ width, height }: LogoProps) {
    return (
        <Link href="/">
            <Image
                src="/generallogoblue.png"
                alt="logo"
                priority
                width={width}
                height={height}
            />
        </Link>
    );
}
