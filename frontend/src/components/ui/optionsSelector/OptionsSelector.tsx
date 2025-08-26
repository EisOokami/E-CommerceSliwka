"use client";

import Link from "next/link";
import { OptionsSelectorProps } from "./OptionsSelector.interfaces";

export default function OptionsSelector({
    productData,
}: Readonly<OptionsSelectorProps>) {
    return (
        <div className="grid gap-3">
            {productData.options.map((option) => (
                <div key={option.id} className="grid gap-1">
                    <p>{option.title}</p>
                    <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-2 md:gap-3">
                        {option.optionsArray.map((optionArrayData) => (
                            <Link
                                key={optionArrayData.id}
                                href={`/catalog/${optionArrayData.productSlug}`}
                                className={`text-center w-full py-3 border rounded-xl ${
                                    productData.slug ===
                                    optionArrayData.productSlug
                                        ? "border-black text-black pointer-events-none"
                                        : "text-gray-600"
                                }`}
                                tabIndex={
                                    productData.slug ===
                                    optionArrayData.productSlug
                                        ? -1
                                        : undefined
                                }
                            >
                                {optionArrayData.optionName}
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
