"use client";

import Link from "next/link";
import { LuPencil, LuPlus, LuTrash2 } from "react-icons/lu";
import { solidButtonClass } from "@/constants/styles";
import { cn } from "@/lib/utils";
import { deleteCatalogRecord } from "@/data/admin/actions/catalogClient";
import { CouponsProps } from "./Coupons.interfaces";

import ResourceTable from "@/components/ui/admin/resourceTable/ResourceTable";
import { StatusBadge } from "@/components/ui/admin/apiState/ApiState";
import { useAdminSession } from "../../auth/AdminSessionProvider";

export default function Coupons({ initialData }: Readonly<CouponsProps>) {
    const { can, confirmAction } = useAdminSession();

    return (
        <ResourceTable
            title="Coupons"
            initialData={initialData}
            statuses={["enabled", "disabled"]}
            actions={
                can("coupons.create") && (
                    <Link
                        href="/admin/coupons/new"
                        className={cn(
                            solidButtonClass,
                            "h-9 px-6 md:text-sm gap-1.5",
                        )}
                    >
                        <LuPlus size={13} /> Add coupon
                    </Link>
                )
            }
            columns={[
                {
                    title: "Code",
                    cell: (coupon) => (
                        <Link href={"/admin/coupons/" + coupon.id}>
                            {coupon.code}
                        </Link>
                    ),
                },
                {
                    title: "Discount",
                    cell: (coupon) =>
                        coupon.kind === "percentage"
                            ? coupon.amount + "%"
                            : (coupon.amount / 100).toFixed(2) + " USD",
                },
                {
                    title: "Status",
                    cell: (coupon) => (
                        <StatusBadge>
                            {coupon.enabled ? "Enabled" : "Disabled"}
                        </StatusBadge>
                    ),
                },
                {
                    title: "Expires",
                    cell: (coupon) =>
                        coupon.expiresAt
                            ? new Date(coupon.expiresAt).toLocaleString()
                            : "-",
                },
                {
                    title: "Usage limit",
                    cell: (coupon) => coupon.usageLimit ?? "Unlimited",
                },
                {
                    title: "Actions",
                    cell: (coupon, reload) => (
                        <div className="flex items-center gap-1 md:opacity-0 md:transition-opacity md:group-hover:opacity-100 md:focus-within:opacity-100">
                            <Link
                                className="inline-flex items-center justify-center rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400"
                                href={"/admin/coupons/" + coupon.id}
                                title="View / Edit"
                            >
                                <LuPencil size={13} />
                            </Link>
                            {can("coupons.delete") && (
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center rounded p-1.5 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400"
                                    title="Delete"
                                    onClick={async () => {
                                        if (
                                            await confirmAction(
                                                "Delete coupon " +
                                                    coupon.code +
                                                    "?",
                                                (reauthentication) =>
                                                    deleteCatalogRecord(
                                                        "coupons",
                                                        coupon.id,
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
