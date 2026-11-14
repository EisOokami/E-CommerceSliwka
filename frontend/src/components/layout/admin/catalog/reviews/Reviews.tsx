"use client";

import { useState } from "react";
import Link from "next/link";
import { LuStar, LuTrash2 } from "react-icons/lu";
import { errorMessage } from "@/data/admin/services/errors";
import {
    deleteCatalogRecord,
    moderateReview,
} from "@/data/admin/actions/catalogClient";
import { cn } from "@/lib/utils";
import { focusClass } from "@/constants/styles";
import { ReviewsProps } from "./Reviews.interfaces";

import { StatusBadge } from "@/components/ui/admin/apiState/ApiState";
import ResourceTable from "@/components/ui/admin/resourceTable/ResourceTable";
import { useAdminSession } from "../../auth/AdminSessionProvider";

export default function Reviews({ initialData }: Readonly<ReviewsProps>) {
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);
    const { can, confirmAction } = useAdminSession();

    return (
        <div className="flex flex-1 min-h-0 flex-col">
            {error && (
                <p
                    role="alert"
                    className="border-b border-red-200 bg-red-50 px-6 py-2 text-xs text-red-700"
                >
                    {error}
                </p>
            )}
            <ResourceTable
                title="Reviews"
                initialData={initialData}
                statuses={["visible", "hidden"]}
                columns={[
                    {
                        title: "Review",
                        cell: (review) => (
                            <details>
                                <summary className="cursor-pointer text-xs text-gray-700 hover:text-gray-900">
                                    {review.description.slice(0, 70)}
                                    {review.description.length > 70 && "..."}
                                </summary>
                                <p className="max-w-lg whitespace-pre-wrap py-3 text-xs leading-relaxed text-gray-700">
                                    {review.description}
                                </p>
                            </details>
                        ),
                    },
                    {
                        title: "Product",
                        cell: (review) => (
                            <Link
                                className="text-xs text-gray-700 hover:text-gray-900 hover:underline"
                                href={"/admin/products/" + review.productId}
                            >
                                {review.productName}
                            </Link>
                        ),
                    },
                    {
                        title: "Customer",
                        cell: (review) => (
                            <Link
                                className="text-xs font-medium text-gray-900 hover:underline"
                                href={"/admin/customers/" + review.userId}
                            >
                                {review.userName}
                            </Link>
                        ),
                    },
                    {
                        title: "Rating",
                        cell: (review) => (
                            <div
                                role="img"
                                className="flex items-center gap-0.5"
                            >
                                {Array.from({ length: 5 }, (_, index) => (
                                    <LuStar
                                        key={index}
                                        size={13}
                                        className={
                                            index < review.rating
                                                ? "fill-amber-400 text-amber-400"
                                                : "text-gray-200"
                                        }
                                    />
                                ))}
                            </div>
                        ),
                    },
                    {
                        title: "Status",
                        cell: (review) => (
                            <StatusBadge>
                                {review.visible ? "Visible" : "Hidden"}
                            </StatusBadge>
                        ),
                    },
                    {
                        title: "Actions",
                        cell: (review, reload) => (
                            <div className="flex items-center gap-1">
                                {can("reviews.update") && (
                                    <button
                                        type="button"
                                        className={cn(
                                            focusClass,
                                            review.visible
                                                ? "h-7 rounded-md border border-gray-200 px-2.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                : "h-7 rounded-md bg-gray-900 px-2.5 text-xs font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50",
                                        )}
                                        disabled={busy}
                                        onClick={async () => {
                                            if (busy) {
                                                return;
                                            }

                                            setBusy(true);

                                            try {
                                                setError("");

                                                await moderateReview(
                                                    review.id,
                                                    !review.visible,
                                                );

                                                reload();
                                            } catch (e) {
                                                setError(errorMessage(e));
                                            } finally {
                                                setBusy(false);
                                            }
                                        }}
                                    >
                                        {review.visible ? "Hide" : "Publish"}
                                    </button>
                                )}
                                {can("reviews.delete") && (
                                    <button
                                        type="button"
                                        className="flex h-7 items-center justify-center rounded-md border border-gray-200 px-2 text-red-500 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400"
                                        title="Delete"
                                        onClick={async () => {
                                            if (
                                                await confirmAction(
                                                    "Delete this review?",
                                                    (reauthentication) =>
                                                        deleteCatalogRecord(
                                                            "reviews",
                                                            review.id,
                                                            reauthentication,
                                                        ),
                                                )
                                            ) {
                                                reload();
                                            }
                                        }}
                                    >
                                        <LuTrash2 size={12} />
                                    </button>
                                )}
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    );
}
