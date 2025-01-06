import Image from "next/image";

interface LogoProps {
    width: number | `${number}` | undefined;
    height: number | `${number}` | undefined;
}

export default function Logo({ width, height }: LogoProps) {
    return (
        <div>
            <Image
                src="/generallogoblue.png"
                alt="logo"
                priority
                width={width}
                height={height}
            />
        </div>
    );
}
