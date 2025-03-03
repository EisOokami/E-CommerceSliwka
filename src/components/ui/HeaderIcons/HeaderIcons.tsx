import Link from "next/link";
import {
    IoCartOutline,
    IoPersonOutline,
    IoHeartOutline,
} from "react-icons/io5";
import { HeaderIconsProps } from "./HeaderIcons.interfaces";

function selectSocialIcon(url: string) {
    if (url.includes("favorite")) {
        return <IoHeartOutline />;
    }

    if (url.includes("cart")) {
        return <IoCartOutline />;
    }

    if (url.includes("account")) {
        return <IoPersonOutline />;
    }

    return null;
}

export default function HeaderIcons({ iconsLink }: Readonly<HeaderIconsProps>) {
    return (
        <div className="flex justify-around md:justify-normal items-center gap-5 text-2xl">
            {iconsLink.map(({ id, url, text }) => (
                <Link key={id} href={url ?? ""}>
                    {selectSocialIcon(text)}
                </Link>
            ))}
        </div>
    );
}
