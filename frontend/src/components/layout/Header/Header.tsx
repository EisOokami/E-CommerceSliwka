"use client";

import { useCallback, useRef, useState } from "react";
import { Squash as Hamburger } from "hamburger-react";
import useClickOutside from "@/hooks/UseClickOutside";
import { HeaderProps } from "./Header.interfaces";

import Logo from "@/components/ui/logo/Logo";
import HeaderIcons from "@/components/ui/HeaderIcons/HeaderIcons";
import Navigation from "@/components/ui/navigation/Navigation";
import SearchBarHeader from "@/components/ui/searchBarHeader/SearchBarHeader";

export default function Header({
    data,
    isUserSingIn,
    cartsCount,
    wishlistsCount,
}: Readonly<HeaderProps>) {
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const containerNavbarMenu = useRef<HTMLDivElement>(null);
    const hamburgerRef = useRef<HTMLDivElement>(null);

    useClickOutside(containerNavbarMenu, () => handleCloseMenu(), [
        hamburgerRef,
    ]);

    const { logoImage, iconsLink, logoLink, navigationLinks } = data;

    const handleOpenMenu = () => {
        setTimeout(() => setIsVisible(true), 10);
        setIsMounted(true);
    };

    const handleCloseMenu = useCallback(() => {
        setTimeout(() => setIsMounted(false), 200);
        setIsVisible(false);
    }, []);

    const toggleMenu = (toggled: boolean) => {
        if (!toggled) {
            handleCloseMenu();
        }

        if (toggled) {
            handleOpenMenu();
        }
    };

    const styleMenuBorder = isMounted ? "border-t" : "";

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
                        handleCloseMenu={handleCloseMenu}
                    />
                </div>
                <div className="hidden md:flex-1 md:flex md:justify-end items-center gap-5">
                    <SearchBarHeader handleCloseMenu={handleCloseMenu} />
                    <HeaderIcons
                        iconsLink={iconsLink}
                        isUserSingIn={isUserSingIn}
                        handleCloseMenu={handleCloseMenu}
                        cartsCount={cartsCount}
                        wishlistsCount={wishlistsCount}
                    />
                </div>
                <div ref={hamburgerRef} className="block md:hidden">
                    <Hamburger toggled={isMounted} onToggle={toggleMenu} />
                </div>
            </div>
            {isMounted && (
                <div
                    className={`md:hidden absolute top-full left-0 w-full h-svh bg-black/50 transition-all duration-200 ease-out ${styleMenuBorder} ${
                        isVisible
                            ? "opacity-100"
                            : "opacity-0 pointer-events-none"
                    }`}
                >
                    <div
                        ref={containerNavbarMenu}
                        className={`grid gap-5 p-5 bg-white transition-all duration-200 ease-out ${
                            isVisible
                                ? "translate-y-0"
                                : "translate-y-1 pointer-events-none"
                        }`}
                    >
                        <Navigation
                            navigationLinks={navigationLinks}
                            handleCloseMenu={handleCloseMenu}
                        />
                        <SearchBarHeader handleCloseMenu={handleCloseMenu} />
                        <HeaderIcons
                            iconsLink={iconsLink}
                            isUserSingIn={isUserSingIn}
                            handleCloseMenu={handleCloseMenu}
                            cartsCount={cartsCount}
                            wishlistsCount={wishlistsCount}
                        />
                    </div>
                </div>
            )}
        </header>
    );
}
