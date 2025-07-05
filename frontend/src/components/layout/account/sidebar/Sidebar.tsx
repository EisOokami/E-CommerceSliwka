"use client";

import { memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuClock } from "react-icons/lu";
import { IoPersonOutline } from "react-icons/io5";

const initialSidebarItems = [
    {
        icon: IoPersonOutline,
        name: "Account Details",
        url: "/account/account-details",
    },
    {
        icon: LuClock,
        name: "Order History",
        url: "/account/order-history",
    },
];

const Sidebar = memo(function Sidebar() {
    const currentPath = usePathname();

    return (
        <nav className="grid md:w-1/3 lg:w-1/4 xl:w-1/5 h-min py-2 rounded-lg shadow-lg">
            {initialSidebarItems.map((item, i) => (
                <Link
                    key={i}
                    href={item.url}
                    className={`flex items-center gap-1.5 px-3 py-2 ${
                        currentPath === item.url
                            ? "text-black"
                            : "text-gray-500 hover:text-gray-800"
                    }`}
                >
                    <item.icon className="text-xl" />
                    <span className="text-lg">{item.name}</span>
                </Link>
            ))}
        </nav>
    );
});

export default Sidebar;
