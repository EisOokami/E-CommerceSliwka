import Image from "next/image";
import { FaRegHeart } from "react-icons/fa6";
import Button from "@/components/ui/button/Button";
import { CardProps } from "./Card.interfaces";

export default function Card({
    imageSrc,
    imageAlt,
    imageWidth,
    imageHeight,
    title,
    price,
    buttonHref,
    buttonTheme,
    buttonText,
    buttonInline,
}: CardProps) {
    return (
        <div className="grid justify-items-center gap-3 p-3 md:p-8 bg-gray-100 rounded-md cursor-pointer">
            <FaRegHeart className="justify-self-end text-2xl md:text-3xl text-gray-500" />
            <Image
                src={imageSrc}
                alt={imageAlt}
                width={imageWidth}
                height={imageHeight}
            />
            <span className="text-center md:text-lg font-medium">{title}</span>
            <span className="text-2xl md:text-3xl font-semibold">{price}</span>
            <Button
                href={buttonHref}
                theme={buttonTheme}
                text={buttonText}
                inline={buttonInline}
            />
        </div>
    );
}
