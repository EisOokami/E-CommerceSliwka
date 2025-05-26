"use client";

import { useRef, useState } from "react";
import { Squash as Hamburger } from "hamburger-react";
import useClickOutside from "@/hooks/UseClickOutside";
import { HeaderProps } from "./Header.interfaces";

import Logo from "@/components/ui/logo/Logo";
import HeaderIcons from "@/components/ui/HeaderIcons/HeaderIcons";
import Navigation from "@/components/ui/navigation/Navigation";
import SearchBar from "@/components/ui/searchBar/SearchBar";

export default function Header({ data, isUserSingIn }: Readonly<HeaderProps>) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const containerNavbarMenu = useRef<HTMLDivElement>(null);
    const hamburgerRef = useRef<HTMLDivElement>(null);

    useClickOutside(
        containerNavbarMenu,
        () => {
            setIsOpen(false);
        },
        [hamburgerRef],
    );

    const { logoImage, iconsLink, logoLink, navigationLinks } = data;

    const styleMenuBorder = isOpen ? "border-t" : "";

    return (
        <header className="sticky top-0 p-3 md:px-5 bg-white border-b z-50">
            <div className="flex justify-between items-center container mx-auto">
                <div className="lg:flex-1">
                    <Logo
                        width={50}
                        height={50}
                        src={logoImage.url}
                        alt={logoImage.alternativeText}
                        link={logoLink.url}
                    />
                </div>
                <div className="hidden md:flex-1 md:flex md:justify-center">
                    <Navigation
                        navigationLinks={navigationLinks}
                        setIsOpen={setIsOpen}
                    />
                </div>
                <div className="hidden md:flex-1 md:flex md:justify-end items-center gap-5">
                    <SearchBar setIsOpenMenu={setIsOpen} />
                    <HeaderIcons
                        iconsLink={iconsLink}
                        isUserSingIn={isUserSingIn}
                        setIsOpen={setIsOpen}
                    />
                </div>
                <div ref={hamburgerRef} className="block md:hidden">
                    <Hamburger toggled={isOpen} toggle={setIsOpen} />
                </div>
            </div>
            {isOpen && (
                <div
                    className={`md:hidden absolute top-full left-0 w-full h-svh bg-black/50 ${styleMenuBorder}`}
                >
                    <div
                        ref={containerNavbarMenu}
                        className="grid gap-5 p-5 bg-white"
                    >
                        <Navigation
                            navigationLinks={navigationLinks}
                            setIsOpen={setIsOpen}
                        />
                        <SearchBar setIsOpenMenu={setIsOpen} />
                        <HeaderIcons
                            iconsLink={iconsLink}
                            isUserSingIn={isUserSingIn}
                            setIsOpen={setIsOpen}
                        />
                    </div>
                </div>
            )}
        </header>
    );
}
