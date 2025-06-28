"use client";

import { memo, useCallback, useRef, useState } from "react";
import { logoutAction } from "@/data/actions/authActions";
import useClickOutside from "@/hooks/UseClickOutside";
import { LuClock } from "react-icons/lu";
import { IoPersonOutline, IoPersonAddOutline } from "react-icons/io5";
import { RiLoginBoxLine, RiLogoutBoxLine } from "react-icons/ri";
import { ProfileButtonProps } from "./ProfileButton.interfaces";

import Tooltip from "../tooltip/Tooltip";
import DropdownLink from "./DropdownLink";

const ProfileButton = memo(function ProfileButton({
    isUserSingIn,
    text,
    handleCloseMenu,
}: Readonly<ProfileButtonProps>) {
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const btnRef = useRef<HTMLButtonElement>(null);

    useClickOutside(dropdownRef, () => handleCloseDropdown(), [btnRef]);

    const handleOpenDropdown = () => {
        setTimeout(() => setIsVisible(true), 10);
        setIsMounted(true);
    };

    const handleCloseDropdown = useCallback((isLink?: boolean) => {
        setTimeout(() => setIsMounted(false), 200);
        setIsVisible(false);

        if (isLink) {
            handleCloseMenu();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleDropdown = () => {
        if (isVisible) {
            handleCloseDropdown();
        }

        if (!isVisible) {
            handleOpenDropdown();
        }
    };

    return (
        <div className="relative">
            {!isVisible && (
                <Tooltip message={text}>
                    <button
                        ref={btnRef}
                        onClick={toggleDropdown}
                        className="flex items-center"
                    >
                        <IoPersonOutline />
                    </button>
                </Tooltip>
            )}
            {isVisible && (
                <button
                    ref={btnRef}
                    onClick={toggleDropdown}
                    className="flex items-center"
                >
                    <IoPersonOutline />
                </button>
            )}
            {isMounted && (
                <div
                    ref={dropdownRef}
                    className={`absolute right-0 w-56 mt-3 py-1 bg-white border border-gray-300 rounded-lg shadow-lg ring-1 ring-black/5 z-10 transform transition-all duration-200 ease-out
                            ${
                                isVisible
                                    ? "opacity-100 scale-100"
                                    : "opacity-0 scale-95 pointer-events-none"
                            }`}
                >
                    {isUserSingIn ? (
                        <>
                            <DropdownLink
                                href="/account/account-details"
                                icon={<IoPersonOutline />}
                                label="Account settings"
                                onClick={() => handleCloseDropdown(true)}
                            />
                            <DropdownLink
                                href="/account/order-history"
                                icon={<LuClock />}
                                label="Order History"
                                onClick={() => handleCloseDropdown(true)}
                            />
                            <form
                                action={logoutAction}
                                onSubmit={() => handleCloseDropdown(true)}
                                className="mt-1 pt-1 border-t border-gray-300"
                            >
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 w-full px-5 py-2 text-lg text-gray-700 hover:text-black hover:bg-gray-100 transition"
                                >
                                    <RiLogoutBoxLine />
                                    Sign out
                                </button>
                            </form>
                        </>
                    ) : (
                        <div>
                            <DropdownLink
                                href="/signIn"
                                icon={<RiLoginBoxLine />}
                                label="Sign In"
                                onClick={() => handleCloseDropdown(true)}
                            />
                            <DropdownLink
                                href="/signUp"
                                icon={<IoPersonAddOutline />}
                                label="Sign Up"
                                onClick={() => handleCloseDropdown(true)}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
});

export default ProfileButton;
