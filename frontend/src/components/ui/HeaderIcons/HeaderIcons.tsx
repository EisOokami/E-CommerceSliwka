"use client";

import Link from "next/link";
import { IoCartOutline, IoHeartOutline } from "react-icons/io5";
import { HeaderIconsProps } from "./HeaderIcons.interfaces";

import ProfileButton from "../profileButton/ProfileButton";
import Tooltip from "../tooltip/Tooltip";

const selectHeaderIcon = (url: string) => {
    if (url.includes("wishlist")) {
        return <IoHeartOutline />;
    }

    if (url.includes("cart")) {
        return <IoCartOutline />;
    }

    return null;
};

export default function HeaderIcons({
    iconsLink,
    isUserSingIn,
    setIsOpen,
}: Readonly<HeaderIconsProps>) {
    const handleCloseMenu = () => {
        setIsOpen(false);
    };

    return (
        <div className="flex justify-around md:justify-normal items-center gap-5 text-2xl">
            {iconsLink.map(({ id, url, text }) => {
                if (!text.includes("profile")) {
                    return (
                        <Tooltip key={id} message={text}>
                            <Link href={url ?? ""} onClick={handleCloseMenu}>
                                {selectHeaderIcon(text)}
                            </Link>
                        </Tooltip>
                    );
                }

                return (
                    <ProfileButton
                        key={id}
                        isUserSingIn={isUserSingIn}
                        text={text}
                        handleCloseMenu={handleCloseMenu}
                    />
                );
            })}
        </div>
    );
}
