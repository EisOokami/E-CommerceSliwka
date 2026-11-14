"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveProduct } from "@/data/admin/actions/client";
import { errorMessage, AdminApiError } from "@/data/admin/services/client";
import {
    cardClass,
    fieldClass,
    focusClass,
    outlineButtonClass,
    solidButtonClass,
} from "@/constants/styles";
import { productInputSchema } from "@/lib/schemas/admin/productEditor";
import { cn } from "@/lib/utils";
import type { ProductInput } from "@/interfaces/admin/api";
import { ProductEditorProps } from "./ProductEditor.interfaces";

import { useAdminSession } from "../../auth/AdminSessionProvider";
import TopBar from "@/components/ui/admin/topBar/TopBar";
import { Field } from "@/components/ui/admin/apiState/ApiState";
import ProductImages from "../productImages/ProductImages";
import ProductDetailsFields from "../productDetailsFields/ProductDetailsFields";

const empty: ProductInput = {
    name: "",
    description: "",
    imageId: "",
    slug: "",
    category: "Smartphones",
    price: "0",
    discountedPrice: "0",
    isDiscount: false,
    quantity: 0,
    color: "#000000",
    visibility: "draft",
};

export default function ProductEditor({
    id,
    initialData,
    categoryOptions,
    images,
}: Readonly<ProductEditorProps>) {
    const [data, setData] = useState(initialData ?? empty);
    const [tab, setTab] = useState("general");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const { can } = useAdminSession();

    const writable = can(id ? "products.update" : "products.create");
    const categories = [
        ...new Set([data.category, ...categoryOptions.map((v) => v.name)]),
    ].filter(Boolean);

    const field = <K extends keyof ProductInput>(
        key: K,
        value: ProductInput[K],
    ) => setData((current) => ({ ...current, [key]: value }));

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (busy || !writable) {
            return;
        }

        const result = productInputSchema.safeParse(data);

        if (!result.success) {
            const issue = result.error.issues[0];

            setTab(
                ["price", "discountedPrice"].includes(String(issue.path[0]))
                    ? "pricing"
                    : "general",
            );
            setError(issue.path.join(".") + ": " + issue.message);

            return;
        }

        setBusy(true);
        setError("");

        try {
            await saveProduct({ ...data, ...result.data }, id);

            router.push("/admin/products");
            router.refresh();
        } catch (reason) {
            setError(
                reason instanceof AdminApiError && reason.details.length
                    ? reason.details
                          .map((detail) => detail.field + ": " + detail.message)
                          .join(" · ")
                    : errorMessage(reason),
            );
        } finally {
            setBusy(false);
        }
    };

    return (
        <form noValidate onSubmit={submit} className="flex-1 overflow-y-auto">
            <TopBar
                title={id ? "Product Editor" : "Create Product"}
                crumbs={[
                    { label: "Dashboard", href: "/admin/dashboard" },
                    {
                        label: "Products",
                        href: "/admin/products",
                    },
                    { label: id ? "Editor" : "Creator" },
                ]}
                actions={
                    <div className="flex gap-2">
                        <Link
                            href="/admin/products"
                            className={cn(outlineButtonClass, "h-9 px-6")}
                        >
                            Cancel
                        </Link>
                        {writable && (
                            <button
                                disabled={busy}
                                className={cn(solidButtonClass, "h-9 px-6")}
                            >
                                {busy ? "Saving..." : "Save Changes"}
                            </button>
                        )}
                    </div>
                }
            />
            <div className="p-6 max-w-5xl">
                <div className="flex gap-1 border-b border-gray-200 mb-6">
                    {["general", "pricing", "images", "details"].map(
                        (value) => (
                            <button
                                type="button"
                                key={value}
                                onClick={() => setTab(value)}
                                className={
                                    "px-3 py-2 text-xs font-medium capitalize border-b-2 " +
                                    (tab === value
                                        ? "border-black text-black"
                                        : "border-transparent text-gray-500")
                                }
                            >
                                {value}
                            </button>
                        ),
                    )}
                </div>
                {error && (
                    <p role="alert" className="mb-4 text-sm text-red-600">
                        {error}
                    </p>
                )}
                <fieldset disabled={busy || !writable} className="space-y-4">
                    <div
                        className={
                            tab === "general"
                                ? "grid grid-cols-1 lg:grid-cols-3 gap-4"
                                : "hidden"
                        }
                    >
                        <div className={cardClass + " lg:col-span-2 space-y-4"}>
                            <h2 className="text-lg font-semibold">
                                General Information
                            </h2>
                            <Field label="Product Name">
                                <input
                                    required
                                    maxLength={255}
                                    className={fieldClass}
                                    value={data.name}
                                    onChange={(event) =>
                                        field("name", event.target.value)
                                    }
                                />
                            </Field>
                            <Field label="Description">
                                <textarea
                                    maxLength={6000}
                                    rows={5}
                                    className={fieldClass + " h-auto py-2"}
                                    value={data.description}
                                    onChange={(event) =>
                                        field("description", event.target.value)
                                    }
                                />
                            </Field>
                            <Field label="Slug">
                                <input
                                    required
                                    pattern="[a-z0-9]+(-[a-z0-9]+)*"
                                    className={fieldClass}
                                    value={data.slug}
                                    onChange={(event) =>
                                        field("slug", event.target.value)
                                    }
                                />
                            </Field>
                            <Field label="Category">
                                <select
                                    className={cn(
                                        fieldClass,
                                        `appearance-none pr-11 bg-no-repeat bg-[position:right_1rem_center] bg-[length:1.25rem] bg-[url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2020%2020'%3E%3Cpath%20fill='none'%20stroke='%236b7280'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke-width='1.5'%20d='M6%208l4%204%204-4'/%3E%3C/svg%3E")]`,
                                    )}
                                    value={data.category}
                                    onChange={(event) =>
                                        field("category", event.target.value)
                                    }
                                >
                                    {categories.map((category) => (
                                        <option key={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                            <Field label="Image reference">
                                <input
                                    required
                                    pattern="[0-9a-fA-F-]{36}"
                                    placeholder="Existing image UUID"
                                    className={fieldClass}
                                    value={data.imageId}
                                    onChange={(event) =>
                                        field("imageId", event.target.value)
                                    }
                                />
                            </Field>
                            <p className="text-xs text-gray-500">
                                Use an existing product image reference. New
                                image uploads and gallery editing are not
                                available here yet.
                            </p>
                        </div>
                        <div className={cardClass + " space-y-4"}>
                            <h2 className="text-lg font-semibold">
                                Product Status
                            </h2>
                            <Field label="Visibility">
                                <select
                                    className={cn(
                                        fieldClass,
                                        `capitalize appearance-none pr-11 bg-no-repeat bg-[position:right_1rem_center] bg-[length:1.25rem] bg-[url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2020%2020'%3E%3Cpath%20fill='none'%20stroke='%236b7280'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke-width='1.5'%20d='M6%208l4%204%204-4'/%3E%3C/svg%3E")]`,
                                    )}
                                    value={data.visibility}
                                    onChange={(event) =>
                                        field(
                                            "visibility",
                                            event.target
                                                .value as ProductInput["visibility"],
                                        )
                                    }
                                >
                                    {["visible", "draft", "hidden"].map(
                                        (value) => (
                                            <option
                                                key={value}
                                                className="capitalize"
                                            >
                                                {value}
                                            </option>
                                        ),
                                    )}
                                </select>
                            </Field>
                            <Field label="Quantity">
                                <input
                                    type="number"
                                    min={0}
                                    max={2147483647}
                                    step={1}
                                    required
                                    className={fieldClass}
                                    value={data.quantity}
                                    onChange={(event) =>
                                        field(
                                            "quantity",
                                            Number(event.target.value),
                                        )
                                    }
                                />
                            </Field>
                            <Field label="Color">
                                <div
                                    className={`${fieldClass} flex items-center gap-3`}
                                >
                                    <input
                                        type="color"
                                        className={cn(
                                            focusClass,
                                            "size-7 shrink-0 cursor-pointer appearance-none rounded-md border-0 bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-m [&::-webkit-color-swatch]:border [&::-webkit-color-swatch]:border-gray-200 [&::-moz-color-swatch]:rounded-md [&::-moz-color-swatch]:border [&::-moz-color-swatch]:border-gray-200",
                                        )}
                                        value={data.color}
                                        onChange={(event) =>
                                            field("color", event.target.value)
                                        }
                                    />
                                    <span className="font-mono text-sm uppercase text-gray-700">
                                        {data.color}
                                    </span>
                                </div>
                            </Field>
                        </div>
                    </div>
                    <div
                        className={
                            tab === "pricing"
                                ? cardClass + " space-y-4"
                                : "hidden"
                        }
                    >
                        <h2 className="text-lg font-semibold">Pricing</h2>
                        <Field label="Price">
                            <input
                                required
                                inputMode="decimal"
                                pattern="[0-9]{1,12}([.][0-9]{1,4})?"
                                className={fieldClass}
                                value={data.price}
                                onChange={(event) =>
                                    field("price", event.target.value)
                                }
                            />
                        </Field>
                        <label className="flex gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={data.isDiscount}
                                onChange={(event) =>
                                    field("isDiscount", event.target.checked)
                                }
                            />
                            Enable discount
                        </label>
                        {data.isDiscount && (
                            <Field label="Discounted price">
                                <input
                                    required
                                    inputMode="decimal"
                                    pattern="[0-9]{1,12}([.][0-9]{1,4})?"
                                    className={fieldClass}
                                    value={data.discountedPrice}
                                    onChange={(event) =>
                                        field(
                                            "discountedPrice",
                                            event.target.value,
                                        )
                                    }
                                />
                            </Field>
                        )}
                    </div>
                    {tab === "images" && (
                        <ProductImages
                            availableImages={images}
                            initialImages={[
                                ...(initialData && initialData.image
                                    ? [initialData.image]
                                    : []),
                                ...(initialData
                                    ? (initialData.sliderImages ?? [])
                                    : []),
                            ]}
                            data={data}
                            onChange={setData}
                        />
                    )}
                    {tab === "details" && (
                        <ProductDetailsFields data={data} onChange={setData} />
                    )}
                </fieldset>
            </div>
        </form>
    );
}
