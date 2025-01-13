"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavigationProps } from "./Navigation.interfaces";

export default function Navigation({ navigationLinks }: NavigationProps) {
    const currentPath = usePathname();

    return (
        <div className="text-center grid gap-2 md:flex md:items-center md:gap-10">
            {navigationLinks.map((navigationLink, i) => (
                <Link
                    key={i}
                    href={navigationLink.href}
                    className={`py-2 md:p-0 text-lg lg:text-xl ${
                        currentPath === navigationLink.href
                            ? "text-black"
                            : "text-gray-500 hover:text-gray-800 transition"
                    }`}
                >
                    {navigationLink.name}
                </Link>
            ))}
        </div>
    );
}
