"use client";

import Link from "next/link";
import { LuEye, LuPencil, LuPlus, LuTrash2 } from "react-icons/lu";
import { deleteProduct } from "@/data/admin/actions/client";
import { solidButtonClass } from "@/constants/styles";
import { cn } from "@/lib/utils";
import { ProductsProps } from "./Products.interfaces";

import { useAdminSession } from "../auth/AdminSessionProvider";
import ResourceTable from "@/components/ui/admin/resourceTable/ResourceTable";
import { StatusBadge } from "@/components/ui/admin/apiState/ApiState";
import ProductThumb from "@/components/ui/admin/productThumb/ProductThumb";

export default function Products({ initialData }: Readonly<ProductsProps>) {
    const { can, confirmAction } = useAdminSession();

    return (
        <ResourceTable
            title="Products"
            initialData={initialData}
            statuses={["visible", "draft", "hidden"]}
            priceSort
            actions={
                can("products.create") && (
                    <Link
                        href="/admin/products/product-creator"
                        className={cn(
                            solidButtonClass,
                            "h-9 px-6 md:text-sm gap-1.5",
                        )}
                    >
                        <LuPlus size={13} />
                        Add Product
                    </Link>
                )
            }
            columns={[
                {
                    title: "Product",
                    cell: (product) => (
                        <div className="flex items-center gap-3">
                            <ProductThumb
                                src={product.image?.fileUrl}
                                alt={product.name}
                            />
                            <Link
                                className="text-xs font-medium text-gray-900 hover:underline"
                                href={"/admin/products/" + product.id}
                            >
                                {product.name}
                            </Link>
                        </div>
                    ),
                },
                { title: "Category", cell: (product) => product.category },
                {
                    title: "Price",
                    cell: (product) => (
                        <span className="font-semibold text-gray-900">
                            {product.finalPrice ?? product.price}
                        </span>
                    ),
                },
                {
                    title: "Stock",
                    cell: (product) => (
                        <span
                            className={
                                product.quantity <= 5 ? "text-amber-700" : ""
                            }
                        >
                            {product.quantity} in stock
                        </span>
                    ),
                },
                {
                    title: "Visibility",
                    cell: (product) => (
                        <StatusBadge>{product.visibility}</StatusBadge>
                    ),
                },
                {
                    title: "Updated",
                    cell: (product) => (
                        <span className="whitespace-nowrap text-[11px] text-gray-400">
                            {product.updatedAt
                                ? new Date(product.updatedAt).toLocaleString()
                                : "-"}
                        </span>
                    ),
                },
                {
                    title: "Actions",
                    cell: (product, reload) => {
                        const canUpdate = can("products.update");
                        const actionLabel = canUpdate ? "Edit" : "View";

                        return (
                            <div className="flex items-center gap-1 md:opacity-0 md:transition-opacity md:group-hover:opacity-100 md:focus-within:opacity-100">
                                <Link
                                    className="inline-flex items-center justify-center rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400"
                                    href={"/admin/products/" + product.id}
                                    title={actionLabel}
                                >
                                    {canUpdate ? (
                                        <LuPencil size={13} />
                                    ) : (
                                        <LuEye size={13} />
                                    )}
                                </Link>
                                {can("products.delete") && (
                                    <button
                                        type="button"
                                        className="inline-flex items-center justify-center rounded p-1.5 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400"
                                        title="Delete"
                                        onClick={async () => {
                                            if (
                                                await confirmAction(
                                                    "Delete " +
                                                        product.name +
                                                        "?",
                                                    (credentials) =>
                                                        deleteProduct(
                                                            product.id,
                                                            credentials,
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
                        );
                    },
                },
            ]}
        />
    );
}
