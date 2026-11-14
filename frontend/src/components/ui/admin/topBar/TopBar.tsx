"use client";

import { LuChevronRight } from "react-icons/lu";
import { TopBarProps } from "./TopBar.interfaces";
import Link from "next/link";

export default function TopBar({
    title,
    actions,
    crumbs,
}: Readonly<TopBarProps>) {
    return (
        <header className="sticky top-0 min-h-[76px] py-3 shrink-0 flex flex-wrap gap-3 items-center justify-between px-5 border-b border-gray-200 bg-white z-50">
            <div className="min-w-0">
                {crumbs && crumbs.length > 0 && (
                    <nav>
                        <ol className="mb-0.5 flex flex-wrap items-center gap-1 text-xs text-gray-500">
                            {crumbs.map((crumb, i) => {
                                const isLast = i === crumbs.length - 1;

                                return (
                                    <li
                                        key={`${crumb.label}-${i}`}
                                        className="flex items-center gap-1"
                                    >
                                        {i > 0 && <LuChevronRight size={11} />}
                                        {!isLast && crumb.href ? (
                                            <Link
                                                href={crumb.href}
                                                className="transition-colors hover:text-black hover:underline"
                                            >
                                                {crumb.label}
                                            </Link>
                                        ) : (
                                            <span
                                                className={
                                                    isLast
                                                        ? "font-medium text-black"
                                                        : ""
                                                }
                                            >
                                                {crumb.label}
                                            </span>
                                        )}
                                    </li>
                                );
                            })}
                        </ol>
                    </nav>
                )}
                <h1 className="font-medium text-black md:text-lg">{title}</h1>
            </div>
            <div className="flex min-w-0 flex-wrap items-center gap-2">
                {actions}
            </div>
        </header>
    );
}
