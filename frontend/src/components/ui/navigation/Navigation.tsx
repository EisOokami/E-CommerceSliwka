"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavigationProps } from "./Navigation.interfaces";

export default function Navigation({
    navigationLinks,
    setIsOpen,
}: Readonly<NavigationProps>) {
    const currentPath = usePathname();

    const handleCloseMenu = () => {
        setIsOpen(false);
    };

    return (
        <nav className="text-center grid gap-2 md:flex md:items-center md:gap-10">
            {navigationLinks.map(({ id, url, text }) => (
                <Link
                    key={id}
                    href={url ?? ""}
                    className={`py-2 md:p-0 text-lg lg:text-xl ${
                        currentPath === url
                            ? "text-black"
                            : "text-gray-500 hover:text-gray-800 transition"
                    }`}
                    onClick={handleCloseMenu}
                >
                    {text}
                </Link>
            ))}
        </nav>
    );
}
