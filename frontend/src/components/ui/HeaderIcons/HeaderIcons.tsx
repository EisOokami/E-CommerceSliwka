import Link from "next/link";
import { IoCartOutline, IoHeartOutline } from "react-icons/io5";
import { HeaderIconsProps } from "./HeaderIcons.interfaces";

import ProfileButton from "../profileButton/ProfileButton";
import Tooltip from "../tooltip/Tooltip";

function selectSocialIcon(url: string) {
    if (url.includes("wishlist")) {
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
                        <Tooltip key={id} message={text}>
                            <Link href={url ?? ""}>
                                {selectSocialIcon(text)}
                            </Link>
                        </Tooltip>
                    );
                }

                return (
                    <ProfileButton
                        key={id}
                        isUserSingIn={isUserSingIn}
                        text={text}
                    />
                );
            })}
        </div>
    );
}
