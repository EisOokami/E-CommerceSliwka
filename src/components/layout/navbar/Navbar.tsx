"use client";

import { useRef, useState } from "react";
import { Squash as Hamburger } from "hamburger-react";
import useClickOutside from "@/hooks/UseClickOutside";

import Logo from "@/components/ui/logo/Logo";
import NavbarIcons from "@/components/ui/navbarIcons/NavbarIcons";
import Navigation from "@/components/ui/navigation/Navigation";
import SearchBar from "@/components/ui/searchBar/SearchBar";

const navigationLinks = [
    {
        name: "Home",
        href: "/",
    },
    {
        name: "About",
        href: "/about",
    },
    {
        name: "Contact Us",
        href: "/contactUs",
    },
];

export default function Navbar() {
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

    return (
        <nav className="relative p-3 bg-white">
            <div className="flex justify-between items-center container mx-auto">
                <div className="lg:flex-1">
                    <Logo width={50} height={50} />
                </div>
                <div className="hidden md:flex-1 md:flex md:justify-center">
                    <Navigation navigationLinks={navigationLinks} />
                </div>
                <div className="hidden md:flex-1 md:flex md:justify-end items-center gap-5">
                    <SearchBar />
                    <NavbarIcons />
                </div>
                <div ref={hamburgerRef} className="block md:hidden">
                    <Hamburger toggled={isOpen} toggle={setIsOpen} />
                </div>
            </div>
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full h-svh bg-black/50">
                    <div
                        ref={containerNavbarMenu}
                        className="grid gap-5 p-5 bg-white"
                    >
                        <Navigation navigationLinks={navigationLinks} />
                        <SearchBar />
                        <NavbarIcons />
                    </div>
                </div>
            )}
        </nav>
    );
}
