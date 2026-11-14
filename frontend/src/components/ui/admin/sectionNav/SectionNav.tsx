"use client";

import { useEffect, useState } from "react";
import { focusClass } from "@/constants/styles";
import { SectionNavProps } from "./SectionNav.interfaces";

export default function SectionNav({ items }: Readonly<SectionNavProps>) {
    const [activeId, setActiveId] = useState<string | null>(null);
    const idsKey = items.map((item) => item.id).join("|");

    useEffect(() => {
        const ids = idsKey.split("|");
        const visible = new Set<string>();

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        visible.add(entry.target.id);
                    }

                    if (!entry.isIntersecting) {
                        visible.delete(entry.target.id);
                    }
                });

                setActiveId(ids.find((id) => visible.has(id)) ?? null);
            },
            { rootMargin: "-30% 0px -60% 0px" },
        );

        ids.forEach((id) => {
            const element = document.getElementById(id);

            if (element) {
                observer.observe(element);
            }
        });

        return () => observer.disconnect();
    }, [idsKey]);

    const scrollTo = (id: string) => {
        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;

        document.getElementById(id)?.scrollIntoView({
            behavior: reduceMotion ? "auto" : "smooth",
            block: "start",
        });
    };

    return (
        <nav
            className={`fixed right-3 top-1/2 z-30 hidden -translate-y-1/2 flex-col transition-opacity duration-200 md:flex ${
                activeId ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
        >
            {items.map((item) => {
                const isActive = item.id === activeId;

                return (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => scrollTo(item.id)}
                        className={`group relative flex h-6 w-9 cursor-pointer items-center justify-end rounded-md ${focusClass}`}
                    >
                        <span
                            className={`h-0.5 rounded-full transition-all duration-200 ${
                                isActive
                                    ? "w-7 bg-gray-900"
                                    : "w-5 bg-gray-300 group-hover:w-7 group-hover:bg-gray-500"
                            }`}
                        />
                        <span className="pointer-events-none absolute right-full mr-2 whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">
                            {item.label}
                        </span>
                    </button>
                );
            })}
        </nav>
    );
}
