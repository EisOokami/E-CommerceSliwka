"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    cardClass,
    fieldClass,
    outlineButtonClass,
    solidButtonClass,
} from "@/constants/styles";
import { errorMessage } from "@/data/admin/services/errors";
import { saveCategory, saveCoupon } from "@/data/admin/actions/catalogClient";
import { cn } from "@/lib/utils";
import { Coupon } from "@/interfaces/admin/catalog";
import { CatalogEditorProps } from "./CatalogEditorinterface";

import { Field } from "@/components/ui/admin/apiState/ApiState";
import TopBar from "@/components/ui/admin/topBar/TopBar";
import { useAdminSession } from "../../auth/AdminSessionProvider";

export default function CatalogEditor({
    resource,
    id,
    initialData,
}: Readonly<CatalogEditorProps>) {
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);
    const { can, confirmAction } = useAdminSession();
    const router = useRouter();

    const writable = can(resource + "." + (id ? "update" : "create"));
    const category = initialData && "name" in initialData ? initialData : null;
    const coupon = initialData && "code" in initialData ? initialData : null;

    const submit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!writable || busy) {
            return;
        }

        const formData = new FormData(e.currentTarget);

        setBusy(true);
        setError("");

        try {
            if (resource === "categories") {
                await saveCategory(
                    {
                        name: String(formData.get("name")),
                        slug: String(formData.get("slug")),
                        description: String(formData.get("description")),
                    },
                    id,
                );

                router.push("/admin/categories");
                router.refresh();
            } else {
                const value: Omit<Coupon, "id"> = {
                    code: String(formData.get("code")),
                    kind:
                        formData.get("kind") === "fixed"
                            ? "fixed"
                            : "percentage",
                    amount:
                        formData.get("kind") === "fixed"
                            ? Math.round(Number(formData.get("amount")) * 100)
                            : Number(formData.get("amount")),
                    currency: "usd",
                    enabled: formData.get("enabled") === "on",
                    expiresAt: formData.get("expiresAt")
                        ? new Date(
                              String(formData.get("expiresAt")),
                          ).toISOString()
                        : null,
                    usageLimit: formData.get("usageLimit")
                        ? Number(formData.get("usageLimit"))
                        : null,
                    minimumMinor: Math.round(
                        Number(formData.get("minimum")) * 100,
                    ),
                };

                if (
                    await confirmAction("Save coupon?", (credentials) =>
                        saveCoupon(value, credentials, id),
                    )
                ) {
                    router.push("/admin/coupons");
                }

                router.refresh();
            }
        } catch (reason) {
            setError(errorMessage(reason));
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="flex-1 overflow-auto">
            <TopBar
                title={
                    (id ? "Edit " : "Create ") +
                    (resource === "categories" ? "category" : "coupon")
                }
                crumbs={[
                    { label: "Dashboard", href: "/admin/dashboard" },
                    {
                        label:
                            resource === "categories"
                                ? "Categories"
                                : "Coupons",
                        href:
                            resource === "categories"
                                ? "/admin/categories"
                                : "/admin/coupons",
                    },
                    { label: id ? "Editor" : "Creator" },
                ]}
                actions={
                    <Link
                        href={"/admin/" + resource}
                        className={cn(
                            outlineButtonClass,
                            "h-9 px-6 md:text-sm gap-1.5",
                        )}
                    >
                        Back
                    </Link>
                }
            />
            <form onSubmit={submit} className="p-6 max-w-3xl">
                <fieldset
                    disabled={!writable || busy}
                    className={cardClass + " space-y-4"}
                >
                    {resource === "categories" ? (
                        <>
                            <Field label="Name">
                                <input
                                    name="name"
                                    defaultValue={category?.name}
                                    required
                                    maxLength={255}
                                    className={fieldClass}
                                />
                            </Field>
                            <Field label="Slug">
                                <input
                                    name="slug"
                                    defaultValue={category?.slug}
                                    required
                                    pattern="[a-z0-9]+(-[a-z0-9]+)*"
                                    maxLength={255}
                                    className={fieldClass}
                                />
                            </Field>
                            <Field label="Description">
                                <textarea
                                    name="description"
                                    defaultValue={category?.description}
                                    maxLength={6000}
                                    className={fieldClass + " h-28"}
                                />
                            </Field>
                            <p className="text-xs text-gray-500">
                                Renaming also updates assigned products.
                                Categories in use cannot be deleted.
                            </p>
                        </>
                    ) : (
                        <>
                            <Field label="Code">
                                <input
                                    name="code"
                                    defaultValue={coupon?.code}
                                    required
                                    pattern="[a-zA-Z0-9_-]{3,50}"
                                    className={fieldClass}
                                />
                            </Field>
                            <Field label="Discount type">
                                <select
                                    name="kind"
                                    defaultValue={coupon?.kind ?? "percentage"}
                                    className={cn(
                                        fieldClass,
                                        `appearance-none pr-11 bg-no-repeat bg-[position:right_1rem_center] bg-[length:1.25rem] bg-[url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2020%2020'%3E%3Cpath%20fill='none'%20stroke='%236b7280'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke-width='1.5'%20d='M6%208l4%204%204-4'/%3E%3C/svg%3E")]`,
                                    )}
                                >
                                    <option value="percentage">
                                        Percentage
                                    </option>
                                    <option value="fixed">
                                        Fixed amount (USD)
                                    </option>
                                </select>
                            </Field>
                            <Field label="Discount value">
                                <input
                                    name="amount"
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    required
                                    defaultValue={
                                        coupon
                                            ? coupon.kind === "fixed"
                                                ? coupon.amount / 100
                                                : coupon.amount
                                            : 10
                                    }
                                    className={fieldClass}
                                />
                            </Field>
                            <Field label="Minimum order (USD)">
                                <input
                                    name="minimum"
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    required
                                    defaultValue={
                                        (coupon?.minimumMinor ?? 0) / 100
                                    }
                                    className={fieldClass}
                                />
                            </Field>
                            <Field label="Expires at (local time)">
                                <input
                                    name="expiresAt"
                                    type="datetime-local"
                                    defaultValue={
                                        coupon?.expiresAt
                                            ? new Date(
                                                  new Date(
                                                      coupon.expiresAt,
                                                  ).getTime() -
                                                      new Date(
                                                          coupon.expiresAt,
                                                      ).getTimezoneOffset() *
                                                          60000,
                                              )
                                                  .toISOString()
                                                  .slice(0, 16)
                                            : ""
                                    }
                                    className={fieldClass}
                                />
                            </Field>
                            <Field label="Total usage limit">
                                <input
                                    name="usageLimit"
                                    type="number"
                                    min={1}
                                    step={1}
                                    defaultValue={coupon?.usageLimit ?? ""}
                                    placeholder="Unlimited"
                                    className={fieldClass}
                                />
                            </Field>
                            <label className="flex gap-2 text-sm">
                                <input
                                    name="enabled"
                                    type="checkbox"
                                    defaultChecked={coupon?.enabled ?? true}
                                />
                                Enabled
                            </label>
                        </>
                    )}
                    {error && <p className="text-red-600 text-sm">{error}</p>}
                    {writable && (
                        <button className={cn(solidButtonClass, "h-9 px-6")}>
                            {busy ? "Saving..." : "Save changes"}
                        </button>
                    )}
                </fieldset>
            </form>
        </div>
    );
}
