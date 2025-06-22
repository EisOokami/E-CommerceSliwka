"use client";

import Link from "next/link";
import useGlobalStore from "@/stores/global";
import { IoCartOutline, IoHeartOutline } from "react-icons/io5";
import { HeaderIconsProps } from "./HeaderIcons.interfaces";

import ProfileButton from "../profileButton/ProfileButton";
import Tooltip from "../tooltip/Tooltip";

const selectHeaderIcon = (
    url: string,
    productsInCartCount: number,
    productsInWishlistCount: number,
) => {
    if (url.includes("wishlist")) {
        return (
            <>
                {productsInWishlistCount ? (
                    <div className="absolute -top-2 -right-2.5 w-min h-min bg-[#0096ff] rounded-full">
                        <span className="block px-1.5 py-0.5 text-xs text-white">
                            {productsInWishlistCount}
                        </span>
                    </div>
                ) : null}
                <IoHeartOutline />
            </>
        );
    }

    if (url.includes("cart")) {
        return (
            <>
                {productsInCartCount ? (
                    <div className="absolute -top-2 -right-2.5 w-min h-min bg-[#0096ff] rounded-full">
                        <span className="block px-1.5 py-0.5 text-xs text-white">
                            {productsInCartCount}
                        </span>
                    </div>
                ) : null}
                <IoCartOutline />
            </>
        );
    }

    return null;
};

export default function HeaderIcons({
    iconsLink,
    isUserSingIn,
    setIsOpen,
    cartsCount,
    wishlistsCount,
}: Readonly<HeaderIconsProps>) {
    const productsInCartCount = useGlobalStore(
        (state) => state.productsInCartCount,
    );
    const productsInWishlistCount = useGlobalStore(
        (state) => state.productsInWishlistCount,
    );
    const handleCloseMenu = () => {
        setIsOpen(false);
    };

    return (
        <div className="flex justify-around md:justify-normal items-center gap-5 text-2xl">
            {iconsLink.map(({ id, url, text }) => {
                if (!text.includes("profile")) {
                    return (
                        <Tooltip key={id} message={text}>
                            <Link
                                href={url ?? ""}
                                onClick={handleCloseMenu}
                                className="relative"
                            >
                                {selectHeaderIcon(
                                    text,
                                    productsInCartCount !== null &&
                                        productsInCartCount >= 0
                                        ? productsInCartCount
                                        : cartsCount,
                                    productsInWishlistCount !== null &&
                                        productsInWishlistCount >= 0
                                        ? productsInWishlistCount
                                        : wishlistsCount,
                                )}
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
