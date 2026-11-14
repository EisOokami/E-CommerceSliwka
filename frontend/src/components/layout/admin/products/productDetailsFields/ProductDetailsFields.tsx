"use client";

import { cardClass, fieldClass } from "@/constants/styles";
import { ProductDetailsFieldsProps } from "./ProductDetailsFields.interfaces";

import Rows from "./rows/Rows";
import { Field } from "@/components/ui/admin/apiState/ApiState";
import GroupCard from "./groupCard/GroupCard";
import GroupSection from "./groupSection/GroupSection";
import { cn } from "@/lib/utils";
import SectionNav from "@/components/ui/admin/sectionNav/SectionNav";

const sections = [
    { id: "section-variants", label: "Colors / variants" },
    { id: "section-specifications", label: "Specifications" },
    { id: "section-delivery", label: "Delivery / warranty" },
    { id: "section-options", label: "Options" },
    { id: "section-detailed-specifications", label: "Detailed specifications" },
];

export default function ProductDetailsFields({
    data,
    onChange,
}: Readonly<ProductDetailsFieldsProps>) {
    const options = data.options ?? [];
    const specGroups = data.productSpecificationGroups ?? [];

    const updateOptionGroup = (
        i: number,
        patch: Partial<(typeof options)[number]>,
    ) => {
        onChange({
            ...data,
            options: options.map((option, j) =>
                j === i ? { ...option, ...patch } : option,
            ),
        });
    };

    const removeOptionGroup = (i: number) => {
        onChange({ ...data, options: options.filter((_, j) => j !== i) });
    };

    const updateSpecGroup = (
        i: number,
        patch: Partial<(typeof specGroups)[number]>,
    ) => {
        onChange({
            ...data,
            productSpecificationGroups: specGroups.map((group, j) =>
                j === i ? { ...group, ...patch } : group,
            ),
        });
    };

    const removeSpecGroup = (i: number) => {
        onChange({
            ...data,
            productSpecificationGroups: specGroups.filter((_, j) => j !== i),
        });
    };

    return (
        <>
            <SectionNav items={sections} />
            <section className={cn(cardClass, "space-y-6")}>
                <div id="section-variants" className="scroll-mt-20">
                    <Rows
                        label="Colors / variants"
                        rows={data.productVariants ?? []}
                        blank={{
                            name: "",
                            hex: "#000000",
                            productSlug: null,
                            inStock: true,
                        }}
                        fields={[
                            { key: "name", label: "Color name" },
                            { key: "hex", label: "Color", type: "color" },
                            {
                                key: "productSlug",
                                label: "Linked product slug",
                            },
                            {
                                key: "inStock",
                                label: "Available",
                                type: "checkbox",
                            },
                        ]}
                        onChange={(productVariants) =>
                            onChange({
                                ...data,
                                productVariants: productVariants.map(
                                    (productVariant) => ({
                                        ...productVariant,
                                        productSlug:
                                            productVariant.productSlug || null,
                                    }),
                                ),
                            })
                        }
                    />
                </div>
                <div id="section-specifications" className="scroll-mt-20">
                    <Rows
                        label="Specifications"
                        rows={data.productSpecifications ?? []}
                        blank={{ name: "", specification: "", icon: "phone" }}
                        fields={[
                            { key: "name", label: "Name" },
                            { key: "specification", label: "Value" },
                            {
                                key: "icon",
                                label: "Icon (phone, cpu, screen, storage, etc.)",
                            },
                        ]}
                        onChange={(productSpecifications) =>
                            onChange({ ...data, productSpecifications })
                        }
                    />
                </div>
                <div id="section-delivery" className="scroll-mt-20">
                    <Rows
                        label="Delivery / warranty"
                        rows={data.productInfos ?? []}
                        blank={{ delivery: "", inStore: "", guaranteed: "" }}
                        fields={[
                            { key: "delivery", label: "Delivery" },
                            { key: "inStore", label: "Store availability" },
                            { key: "guaranteed", label: "Warranty" },
                        ]}
                        onChange={(productInfos) =>
                            onChange({ ...data, productInfos })
                        }
                    />
                </div>
                <div id="section-options" className="scroll-mt-20">
                    <GroupSection
                        title="Options"
                        addLabel="Add option group"
                        emptyText="No option groups yet"
                        count={options.length}
                        onAdd={() =>
                            onChange({
                                ...data,
                                options: [
                                    ...options,
                                    { title: "", optionDetails: [] },
                                ],
                            })
                        }
                    >
                        {options.map((group, i) => (
                            <GroupCard
                                key={i}
                                index={i}
                                onRemove={() => removeOptionGroup(i)}
                            >
                                <Field label="Option group title">
                                    <input
                                        className={fieldClass}
                                        value={group.title}
                                        onChange={(e) =>
                                            updateOptionGroup(i, {
                                                title: e.target.value,
                                            })
                                        }
                                    />
                                </Field>
                                <div className="border-t border-gray-200 pt-5">
                                    <Rows
                                        label="Choices"
                                        rows={group.optionDetails}
                                        blank={{
                                            name: "",
                                            productSlug: null,
                                            inStock: true,
                                        }}
                                        fields={[
                                            { key: "name", label: "Name" },
                                            {
                                                key: "productSlug",
                                                label: "Linked product slug",
                                            },
                                            {
                                                key: "inStock",
                                                label: "Available",
                                                type: "checkbox",
                                            },
                                        ]}
                                        onChange={(values) =>
                                            updateOptionGroup(i, {
                                                optionDetails: values.map(
                                                    (detail) => ({
                                                        ...detail,
                                                        productSlug:
                                                            detail.productSlug ||
                                                            null,
                                                    }),
                                                ),
                                            })
                                        }
                                    />
                                </div>
                            </GroupCard>
                        ))}
                    </GroupSection>
                </div>
                <div
                    id="section-detailed-specifications"
                    className="scroll-mt-20"
                >
                    <GroupSection
                        title="Detailed specifications"
                        addLabel="Add specification group"
                        emptyText="No specification groups yet"
                        count={specGroups.length}
                        onAdd={() =>
                            onChange({
                                ...data,
                                productSpecificationGroups: [
                                    ...specGroups,
                                    { name: "", specifications: [] },
                                ],
                            })
                        }
                    >
                        {specGroups.map((group, i) => (
                            <GroupCard
                                key={i}
                                index={i}
                                onRemove={() => removeSpecGroup(i)}
                            >
                                <Field label="Group name">
                                    <input
                                        className={fieldClass}
                                        value={group.name}
                                        onChange={(e) =>
                                            updateSpecGroup(i, {
                                                name: e.target.value,
                                            })
                                        }
                                    />
                                </Field>
                                <div className="border-t border-gray-200 pt-5">
                                    <Rows
                                        label="Details"
                                        rows={group.specifications}
                                        blank={{ name: "", description: "" }}
                                        fields={[
                                            { key: "name", label: "Name" },
                                            {
                                                key: "description",
                                                label: "Description",
                                            },
                                        ]}
                                        onChange={(specifications) =>
                                            updateSpecGroup(i, {
                                                specifications,
                                            })
                                        }
                                    />
                                </div>
                            </GroupCard>
                        ))}
                    </GroupSection>
                </div>
            </section>
        </>
    );
}
