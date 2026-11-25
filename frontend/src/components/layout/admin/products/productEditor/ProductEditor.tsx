"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    generateProductDescription,
    autofillProduct,
    saveProduct,
} from "@/data/admin/actions/client";
import { LuSparkles } from "react-icons/lu";
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
import type { ProductSuggestions } from "@/interfaces/admin/ai";
import {
    autofillFields,
    planProductAutofill,
} from "@/lib/admin/productAutofill";
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
    const [generating, setGenerating] = useState(false);
    const [generationError, setGenerationError] = useState("");
    const [autofilling, setAutofilling] = useState(false);
    const [autofillError, setAutofillError] = useState("");
    const [autofillStatus, setAutofillStatus] = useState("");
    const [additionalInformation, setAdditionalInformation] = useState("");
    const dataRef = useRef(data);
    const fieldVersions = useRef<Partial<Record<keyof ProductInput, number>>>(
        {},
    );
    const autofillInFlight = useRef(false);
    const router = useRouter();
    const { can } = useAdminSession();

    const writable = can(id ? "products.update" : "products.create");
    const categories = [
        ...new Set([data.category, ...categoryOptions.map((v) => v.name)]),
    ].filter(Boolean);

    const updateData = (next: ProductInput) => {
        for (const key of autofillFields) {
            if (
                JSON.stringify(dataRef.current[key]) !==
                JSON.stringify(next[key])
            ) {
                fieldVersions.current[key] =
                    (fieldVersions.current[key] ?? 0) + 1;
            }
        }

        dataRef.current = next;

        setData(next);
    };

    const field = <K extends keyof ProductInput>(
        key: K,
        value: ProductInput[K],
    ) => updateData({ ...dataRef.current, [key]: value });

    const autoFill = async () => {
        if (
            busy ||
            generating ||
            autofillInFlight.current ||
            !writable ||
            !data.name.trim()
        ) {
            return;
        }

        const snapshot = dataRef.current;
        const versions = { ...fieldVersions.current };

        autofillInFlight.current = true;

        setAutofilling(true);
        setAutofillError("");
        setAutofillStatus("");

        try {
            const suggestions = await autofillProduct({
                name: snapshot.name,
                description: snapshot.description,
                category: snapshot.category,
                specifications: Object.fromEntries(
                    [
                        ...(snapshot.productSpecifications ?? []).map(
                            (item) => [item.name, item.specification],
                        ),
                        ...(snapshot.productSpecificationGroups ?? []).flatMap(
                            (group) =>
                                group.specifications.map((item) => [
                                    [group.name, item.name]
                                        .filter(Boolean)
                                        .join(" / "),
                                    item.description,
                                ]),
                        ),
                    ]
                        .map(([name, value]) => [name.trim(), value.trim()])
                        .filter(
                            ([name, value]) =>
                                name &&
                                value &&
                                name.length <= 100 &&
                                value.length <= 255,
                        )
                        .slice(0, 20),
                ),
                existingDetails: {
                    ...Object.fromEntries(
                        (
                            [
                                "color",
                                "price",
                                "discountedPrice",
                                "isDiscount",
                            ] as const
                        )
                            .filter(
                                (key) =>
                                    id ||
                                    initialData ||
                                    versions[key] !== undefined,
                            )
                            .map((key) => [key, snapshot[key]]),
                    ),
                    productVariants: snapshot.productVariants,
                    productSpecifications: snapshot.productSpecifications,
                    productInfos: snapshot.productInfos,
                    options: snapshot.options,
                    productSpecificationGroups:
                        snapshot.productSpecificationGroups,
                },
                additionalInformation,
            });

            const edited = new Set<keyof ProductInput>(
                autofillFields.filter(
                    (key) => fieldVersions.current[key] !== versions[key],
                ),
            );

            if (edited.has("productSpecificationGroups")) {
                edited.add("productSpecifications");
            }

            if (edited.has("productSpecifications")) {
                edited.add("description");
            }

            const plan = planProductAutofill(
                snapshot,
                dataRef.current,
                suggestions,
                categoryOptions.map((category) => category.name),
                edited,
            );

            const replacements = Object.keys(
                plan.replacements,
            ) as (keyof ProductSuggestions)[];
            const replace =
                replacements.length > 0 &&
                window.confirm(
                    `Replace existing ${replacements
                        .map((key) => {
                            return {
                                name: "product name",
                                description: "description",
                                slug: "slug",
                                category: "category",
                                productSpecifications: "specifications",
                                color: "color",
                                price: "price",
                                discountedPrice: "discounted price",
                                isDiscount: "discount status",
                                productVariants: "variants",
                                options: "options",
                                productSpecificationGroups:
                                    "detailed specifications",
                                productInfos: "delivery / warranty",
                            }[key];
                        })
                        .join(
                            ", ",
                        )} with AI suggestions? Cancel keeps existing values and fills only empty fields.`,
                );
            const patch = {
                ...plan.empty,
                ...(replace ? plan.replacements : {}),
            };

            if (Object.keys(patch).length) {
                updateData({ ...dataRef.current, ...patch });
                setAutofillStatus(
                    "AI suggestions applied. Technical details may come from model knowledge and are not verified. Review all values and availability before saving.",
                );
            }

            if (!Object.keys(patch).length) {
                setAutofillStatus(
                    "No fields changed. Existing values and edits were kept.",
                );
            }
        } catch (reason) {
            setAutofillError(errorMessage(reason));
        } finally {
            autofillInFlight.current = false;

            setAutofilling(false);
        }
    };

    const generateDescription = async () => {
        if (busy || generating || autofillInFlight.current || !writable) {
            return;
        }

        if (!data.name.trim()) {
            setGenerationError(
                "Enter a product name before generating a description.",
            );

            return;
        }

        if (
            data.description.trim() &&
            !window.confirm(
                "Replace the current description with an AI-generated description?",
            )
        ) {
            return;
        }

        setGenerating(true);
        setGenerationError("");

        try {
            const specifications = [
                ...(data.productSpecifications ?? []).map((item) => [
                    item.name,
                    item.specification,
                ]),
                ...(data.productSpecificationGroups ?? []).flatMap((group) =>
                    group.specifications.map((item) => [
                        [group.name, item.name].filter(Boolean).join(" / "),
                        item.description,
                    ]),
                ),
            ]
                .filter(([name, value]) => name.trim() && value.trim())
                .slice(0, 20)
                .map(([name, value]) => [
                    name.trim().slice(0, 100),
                    value.trim().slice(0, 300),
                ]);

            const result = await generateProductDescription({
                name: data.name,
                category: data.category,
                specifications: Object.fromEntries(specifications),
                currentDescription: data.description,
            });

            field("description", result.description);
        } catch (reason) {
            setGenerationError(errorMessage(reason));
        } finally {
            setGenerating(false);
        }
    };

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (busy || generating || autofillInFlight.current || !writable) {
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
                                disabled={busy || generating || autofilling}
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
                {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
                <fieldset
                    disabled={busy || generating || !writable}
                    className="space-y-4"
                >
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
                            {writable && (
                                <div className="space-y-2">
                                    <Field label="Additional information for AI (optional)">
                                        <textarea
                                            maxLength={12000}
                                            rows={3}
                                            disabled={autofilling}
                                            className={
                                                fieldClass + " h-auto py-2"
                                            }
                                            value={additionalInformation}
                                            onChange={(event) =>
                                                setAdditionalInformation(
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Facts as Name: value lines, or JSON using productVariants, options, productSpecificationGroups, color, price, discountedPrice and isDiscount"
                                        />
                                    </Field>
                                    <button
                                        type="button"
                                        onClick={autoFill}
                                        disabled={
                                            busy ||
                                            generating ||
                                            autofilling ||
                                            !data.name.trim()
                                        }
                                        className={cn(
                                            outlineButtonClass,
                                            "h-9 px-3 text-sm",
                                        )}
                                    >
                                        <LuSparkles size={16} />
                                        {autofilling
                                            ? "Auto-filling..."
                                            : "Auto-fill with AI"}
                                    </button>
                                    <p className="text-xs text-gray-500">
                                        Fills empty content fields. Replacing
                                        existing values requires confirmation.
                                        AI notes are used only for generation.
                                        Technical suggestions are not verified.
                                        Review values and availability before
                                        saving.
                                    </p>
                                    {autofillError && (
                                        <p className="text-sm text-red-600">
                                            {autofillError}
                                        </p>
                                    )}
                                    {autofillStatus && (
                                        <p className="text-sm text-gray-600">
                                            {autofillStatus}
                                        </p>
                                    )}
                                </div>
                            )}
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
                            {writable && (
                                <button
                                    type="button"
                                    onClick={generateDescription}
                                    disabled={busy || generating || autofilling}
                                    className={cn(
                                        outlineButtonClass,
                                        "h-9 px-3 text-sm",
                                    )}
                                >
                                    <LuSparkles size={16} />
                                    {generating
                                        ? "Generating..."
                                        : "Generate with AI"}
                                </button>
                            )}
                            {generationError && (
                                <p className="text-sm text-red-600">
                                    {generationError}
                                </p>
                            )}
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
                            onChange={updateData}
                        />
                    )}
                    {tab === "details" && (
                        <ProductDetailsFields
                            data={data}
                            onChange={updateData}
                        />
                    )}
                </fieldset>
            </div>
        </form>
    );
}
