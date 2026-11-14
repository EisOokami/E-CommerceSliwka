"use client";

import Link from "next/link";
import { LuPencil, LuPlus, LuTrash2 } from "react-icons/lu";
import { solidButtonClass } from "@/constants/styles";
import { deleteCatalogRecord } from "@/data/admin/actions/catalogClient";
import { cn } from "@/lib/utils";
import { CategoriesProps } from "./Categories.interfaces";

import { useAdminSession } from "../../auth/AdminSessionProvider";
import ResourceTable from "@/components/ui/admin/resourceTable/ResourceTable";

export default function Categories({ initialData }: Readonly<CategoriesProps>) {
    const { can, confirmAction } = useAdminSession();

    return (
        <ResourceTable
            title="Categories"
            initialData={initialData}
            actions={
                can("categories.create") && (
                    <Link
                        href="/admin/categories/new"
                        className={cn(
                            solidButtonClass,
                            "h-9 px-6 md:text-sm gap-1.5",
                        )}
                    >
                        <LuPlus size={13} /> Add category
                    </Link>
                )
            }
            columns={[
                {
                    title: "Category",
                    cell: (category) => (
                        <Link
                            className="text-xs font-medium text-gray-900 hover:underline"
                            href={"/admin/categories/" + category.id}
                        >
                            {category.name}
                        </Link>
                    ),
                },
                {
                    title: "Slug",
                    cell: (category) => (
                        <span className="font-mono text-[11px] text-gray-500">
                            {category.slug ? "/" + category.slug : "-"}
                        </span>
                    ),
                },
                {
                    title: "Description",
                    cell: (category) => (
                        <span
                            className="block max-w-xs truncate text-xs text-gray-500"
                            title={category.description || undefined}
                        >
                            {category.description || "-"}
                        </span>
                    ),
                },
                {
                    title: "Actions",
                    cell: (category, reload) => (
                        <div className="flex items-center gap-1 md:opacity-0 md:transition-opacity md:group-hover:opacity-100 md:focus-within:opacity-100">
                            <Link
                                className="inline-flex items-center justify-center rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400"
                                href={"/admin/categories/" + category.id}
                                title="View / Edit"
                            >
                                <LuPencil size={13} />
                            </Link>
                            {can("categories.delete") && (
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center rounded p-1.5 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400"
                                    title="Delete"
                                    onClick={async () => {
                                        if (
                                            await confirmAction(
                                                "Delete category " +
                                                    category.name +
                                                    "?",
                                                (reauthentication) =>
                                                    deleteCatalogRecord(
                                                        "categories",
                                                        category.id,
                                                        reauthentication,
                                                    ),
                                            )
                                        ) {
                                            reload();
                                        }
                                    }}
                                >
                                    <LuTrash2 size={13} />
                                </button>
                            )}
                        </div>
                    ),
                },
            ]}
        />
    );
}
