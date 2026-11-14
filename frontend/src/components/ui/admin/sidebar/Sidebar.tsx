"use client";

import { useState } from "react";
import { useAdminSession } from "@/components/layout/admin/auth/AdminSessionProvider";
import { errorMessage } from "@/data/admin/services/client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Logo from "@/components/ui/main/logo/Logo";
import { usePathname } from "next/navigation";
import { FaRegStar } from "react-icons/fa";
import { FiPackage, FiTag } from "react-icons/fi";
import {
    LuLayoutDashboard,
    LuLogOut,
    LuSettings,
    LuShield,
    LuShoppingCart,
    LuTicket,
} from "react-icons/lu";
import { TbUsers } from "react-icons/tb";

const navGroups = [
    {
        label: "Overview",
        items: [
            {
                id: "dashboard",
                icon: LuLayoutDashboard,
                label: "Dashboard",
                href: "/admin/dashboard",
            },
        ],
    },
    {
        label: "Catalog",
        items: [
            {
                id: "products",
                icon: FiPackage,
                label: "Products",
                href: "/admin/products",
            },
            {
                id: "categories",
                icon: FiTag,
                label: "Categories",
                href: "/admin/categories",
            },
        ],
    },
    {
        label: "Commerce",
        items: [
            {
                id: "orders",
                icon: LuShoppingCart,
                label: "Orders",
                href: "/admin/orders",
            },
            {
                id: "customers",
                icon: TbUsers,
                label: "Customers",
                href: "/admin/customers",
            },
            {
                id: "reviews",
                icon: FaRegStar,
                label: "Reviews",
                href: "/admin/reviews",
            },
            {
                id: "coupons",
                icon: LuTicket,
                label: "Coupons",
                href: "/admin/coupons",
            },
        ],
    },
    // {
    //     label: "Insights",
    //     items: [
    //         {
    //             id: "analytics",
    //             icon: FiBarChart2,
    //             label: "Analytics",
    //             href: "/admin/analytics",
    //         },
    //     ],
    // },
    {
        label: "System",
        items: [
            {
                id: "security",
                icon: LuShield,
                label: "Security",
                href: "/admin/security",
            },
            {
                id: "settings",
                icon: LuSettings,
                label: "Settings",
                href: "/admin/settings",
            },
            {
                id: "roles",
                icon: LuShield,
                label: "Roles & Permissions",
                href: "/admin/roles",
            },
        ],
    },
];

const access: Record<string, string[]> = {
    dashboard: ["products.read", "orders.read", "users.read"],
    products: ["products.read"],
    orders: ["orders.read"],
    customers: ["users.read"],
    // analytics: ["products.read", "orders.read", "users.read"],
    settings: ["settings.read"],
    roles: ["admins.read"],
    security: [],
    categories: ["categories.read"],
    reviews: ["reviews.read"],
    coupons: ["coupons.read"],
};

export default function Sidebar() {
    const pathname = usePathname();
    const { admin, can, signOut } = useAdminSession();
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    const groups = navGroups
        .map((group) => ({
            ...group,
            items: group.items.filter(
                (item) => item.id in access && access[item.id].every(can),
            ),
        }))
        .filter((group) => group.items.length);

    return (
        <aside className="w-16 lg:w-64 shrink-0 h-full flex flex-col bg-gray-50 border-r border-gray-200">
            <div className="min-h-[76px] flex items-center justify-center lg:justify-start px-3 lg:px-5 border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <Logo
                        width={36}
                        height={36}
                        src="/icon.ico"
                        alt="Sliwka store"
                        link="/"
                    />
                    <span className="hidden lg:inline text-lg font-semibold text-black">
                        Sliwka
                    </span>
                    <span className="hidden lg:inline ml-1 text-[10px] font-medium text-gray-500 bg-gray-100 border border-gray-200 rounded px-1 py-0.5">
                        Admin
                    </span>
                </div>
            </div>
            <nav className="flex-1 overflow-y-auto py-5 px-2 space-y-5">
                {groups.map((group) => (
                    <div key={group.label}>
                        <p className="hidden lg:block px-2 mb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                            {group.label}
                        </p>
                        {group.items.map((item) => (
                            <Link
                                key={item.id}
                                href={item.href}
                                title={item.label}
                                className={cn(
                                    "w-full flex items-center gap-2.5 px-2.5 py-3 rounded-md text-sm transition-colors duration-100 text-left",
                                    pathname === item.href ||
                                        pathname.startsWith(`${item.href}/`)
                                        ? "bg-black text-white font-medium"
                                        : "text-gray-700 hover:bg-gray-100 hover:text-black",
                                )}
                            >
                                <item.icon
                                    size={20}
                                    className={
                                        pathname === item.href ||
                                        pathname.startsWith(`${item.href}/`)
                                            ? "text-white"
                                            : "text-gray-500"
                                    }
                                />
                                <span className="hidden lg:inline">
                                    {item.label}
                                </span>
                            </Link>
                        ))}
                    </div>
                ))}
            </nav>
            <div className="border-t border-gray-200 p-3">
                {error && (
                    <p role="alert" className="mb-2 text-xs text-red-600">
                        {error}
                    </p>
                )}
                <div className="flex items-center gap-2.5 px-1">
                    <div className="hidden lg:flex w-7 h-7 rounded-full bg-gray-200 items-center justify-center text-xs font-semibold text-gray-700">
                        {admin.fullName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="hidden lg:block flex-1 min-w-0">
                        <p className="text-xs font-medium text-black truncate">
                            {admin.fullName}
                        </p>
                        <p className="text-[10px] text-gray-500">
                            {admin.role}
                        </p>
                    </div>
                    <button
                        disabled={busy}
                        onClick={async () => {
                            setBusy(true);
                            setError("");

                            try {
                                await signOut();
                            } catch (reason) {
                                setError(errorMessage(reason));
                            } finally {
                                setBusy(false);
                            }
                        }}
                        className="text-gray-400 hover:text-black transition-colors disabled:opacity-50"
                    >
                        <LuLogOut size={15} />
                    </button>
                </div>
            </div>
        </aside>
    );
}
