import Link from "next/link";
import { IoCartOutline, IoHeartOutline } from "react-icons/io5";
import { HeaderIconsProps } from "./HeaderIcons.interfaces";

import ProfileButton from "../profileButton/ProfileButton";

function selectSocialIcon(url: string) {
    if (url.includes("favorite")) {
        return <IoHeartOutline />;
    }

    if (url.includes("cart")) {
        return <IoCartOutline />;
    }

    return null;
}

export default function HeaderIcons({
    iconsLink,
    isUserSingIn,
}: Readonly<HeaderIconsProps>) {
    return (
        <div className="flex justify-around md:justify-normal items-center gap-5 text-2xl">
            {iconsLink.map(({ id, url, text }) => {
                if (!text.includes("profile")) {
                    return (
                        <Link key={id} href={url ?? ""}>
                            {selectSocialIcon(text)}
                        </Link>
                    );
                }

                return <ProfileButton key={id} isUserSingIn={isUserSingIn} />;
            })}
        </div>
    );
}
