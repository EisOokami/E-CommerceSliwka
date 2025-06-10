"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { logoutAction } from "@/data/actions/authActions";
import useClickOutside from "@/hooks/UseClickOutside";
import { IoPersonOutline, IoLogOutOutline } from "react-icons/io5";
import { ProfileButtonProps } from "./ProfileButton.interfaces";
import Tooltip from "../tooltip/Tooltip";

export default function ProfileButton({
    isUserSingIn,
    text,
    handleCloseMenu,
}: Readonly<ProfileButtonProps>) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const btnRef = useRef<HTMLButtonElement>(null);

    useClickOutside(dropdownRef, () => setIsOpen(false), [btnRef]);

    const handleOpenDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative">
            {!isOpen && (
                <Tooltip message={text}>
                    <button
                        ref={btnRef}
                        onClick={handleOpenDropdown}
                        className="flex items-center"
                    >
                        <IoPersonOutline />
                    </button>
                </Tooltip>
            )}
            {isOpen && isUserSingIn && (
                <>
                    <button
                        ref={btnRef}
                        onClick={handleOpenDropdown}
                        className="flex items-center"
                    >
                        <IoPersonOutline />
                    </button>
                    <div
                        ref={dropdownRef}
                        className="absolute right-0 w-56 mt-3 py-1 bg-white rounded-md shadow-lg ring-1 ring-black/5 focus:outline-hidden z-10"
                    >
                        <button
                            className="w-full text-left"
                            onClick={() => {
                                handleOpenDropdown();
                                handleCloseMenu();
                            }}
                        >
                            <Link
                                href="/account"
                                className="block w-full px-5 py-2 text-lg text-gray-700"
                            >
                                Account settings
                            </Link>
                        </button>
                        <form
                            action={logoutAction}
                            onSubmit={() => {
                                handleOpenDropdown();
                                handleCloseMenu();
                            }}
                        >
                            <button
                                type="submit"
                                className="flex items-center gap-2 w-full px-5 py-2 text-lg text-gray-700"
                            >
                                Sign out <IoLogOutOutline className="text-lg" />
                            </button>
                        </form>
                    </div>
                </>
            )}
            {isOpen && !isUserSingIn && (
                <>
                    <button
                        ref={btnRef}
                        onClick={handleOpenDropdown}
                        className="flex items-center"
                    >
                        <IoPersonOutline />
                    </button>
                    <div
                        ref={dropdownRef}
                        className="absolute right-0 w-56 mt-3 py-1 bg-white rounded-md shadow-lg ring-1 ring-black/5 focus:outline-hidden z-10"
                    >
                        <button
                            className="w-full text-left"
                            onClick={() => {
                                handleOpenDropdown();
                                handleCloseMenu();
                            }}
                        >
                            <Link
                                href="/signIn"
                                className="block w-full px-5 py-2 text-lg text-gray-700"
                            >
                                Sign In
                            </Link>
                        </button>
                        <button
                            className="w-full text-left"
                            onClick={() => {
                                handleOpenDropdown();
                                handleCloseMenu();
                            }}
                        >
                            <Link
                                href="/signUp"
                                className="block w-full px-5 py-2 text-lg text-gray-700"
                            >
                                Sign Up
                            </Link>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
