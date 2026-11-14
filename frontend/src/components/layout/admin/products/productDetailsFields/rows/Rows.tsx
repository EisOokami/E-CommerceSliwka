"use client";

import { LuPlus } from "react-icons/lu";
import { fieldClass, focusClass, solidButtonClass } from "@/constants/styles";
import { cn } from "@/lib/utils";
import { RowsProps } from "./Rows.interfaces";

import { Field } from "@/components/ui/admin/apiState/ApiState";

export default function Rows<T extends object>({
    label,
    rows,
    fields,
    blank,
    emptyText = `No ${label.toLowerCase()} added yet`,
    onChange,
}: Readonly<RowsProps<T>>) {
    const update = (
        i: number,
        key: (typeof fields)[number]["key"],
        value: string | boolean,
    ) =>
        onChange(
            rows.map((row, index) =>
                index === i ? { ...row, [key]: value } : row,
            ),
        );

    const inputFields = fields.filter((field) => field.type !== "checkbox");
    const checkboxFields = fields.filter((field) => field.type === "checkbox");

    return (
        <section className="space-y-3">
            <div className="flex justify-between">
                <h3 className="text-lg font-semibold">{label}</h3>
                <button
                    type="button"
                    className={cn(solidButtonClass, "h-9 gap-1.5 px-7")}
                    onClick={() => onChange([...rows, { ...blank }])}
                >
                    <LuPlus size={15} /> Add
                </button>
            </div>
            {rows.length === 0 && (
                <div className="rounded-xl border border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
                    {emptyText}
                </div>
            )}
            {rows.map((row, i) => (
                <div
                    key={i}
                    className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                    <div className="mb-4 flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                            #{i + 1}
                        </span>
                        <button
                            type="button"
                            className={cn(
                                focusClass,
                                "rounded-md px-2 py-1 text-sm text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600",
                            )}
                            onClick={() =>
                                onChange(rows.filter((_, index) => index !== i))
                            }
                        >
                            Remove
                        </button>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {inputFields.map((field) => {
                            const value = String(row[field.key] ?? "");

                            return (
                                <Field
                                    key={String(field.key)}
                                    label={field.label}
                                >
                                    {field.type === "color" ? (
                                        <div
                                            className={`${fieldClass} flex items-center gap-3`}
                                        >
                                            <input
                                                type="color"
                                                className={cn(
                                                    focusClass,
                                                    " size-7 shrink-0 cursor-pointer appearance-none rounded-md border-0 bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border [&::-webkit-color-swatch]:border-gray-200 [&::-moz-color-swatch]:rounded-md [&::-moz-color-swatch]:border [&::-moz-color-swatch]:border-gray-200",
                                                )}
                                                value={value}
                                                onChange={(e) =>
                                                    update(
                                                        i,
                                                        field.key,
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <span className="font-mono text-sm uppercase text-gray-700">
                                                {value}
                                            </span>
                                        </div>
                                    ) : (
                                        <input
                                            className={fieldClass}
                                            type={field.type ?? "text"}
                                            value={value}
                                            onChange={(e) =>
                                                update(
                                                    i,
                                                    field.key,
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    )}
                                </Field>
                            );
                        })}
                    </div>
                    {checkboxFields.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-gray-100 pt-4">
                            {checkboxFields.map((field) => (
                                <label
                                    key={String(field.key)}
                                    className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700"
                                >
                                    <input
                                        type="checkbox"
                                        className={cn(
                                            focusClass,
                                            "size-3 shrink-0",
                                        )}
                                        checked={Boolean(row[field.key])}
                                        onChange={(e) =>
                                            update(
                                                i,
                                                field.key,
                                                e.target.checked,
                                            )
                                        }
                                    />
                                    {field.label}
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </section>
    );
}
