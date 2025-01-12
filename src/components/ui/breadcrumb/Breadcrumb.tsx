"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaChevronRight } from "react-icons/fa6";

const Breadcrumbs = () => {
    const pathname = usePathname();

    const pathSegments = pathname.split("/").filter((segment) => segment);

    const breadcrumbPaths = pathSegments.map((_, index) => {
        return `${pathSegments.slice(0, index + 1).join("/")}`;
    });

    return (
        <nav aria-label="breadcrumb">
            <ul className="flex gap-3">
                <li>
                    <Link
                        href="/"
                        className="text-gray-500 hover:text-gray-800 capitalize transition"
                    >
                        Home
                    </Link>
                </li>
                {breadcrumbPaths.map((path, index) => (
                    <li key={path} className="flex items-center gap-3">
                        <FaChevronRight className="text-xs text-gray-500" />
                        {index === breadcrumbPaths.length - 1 ? (
                            <span className="capitalize">
                                {decodeURIComponent(pathSegments[index])}
                            </span>
                        ) : (
                            <Link
                                href={path}
                                className="text-gray-500 hover:text-gray-800 capitalize transition"
                            >
                                {decodeURIComponent(pathSegments[index])}
                            </Link>
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Breadcrumbs;
