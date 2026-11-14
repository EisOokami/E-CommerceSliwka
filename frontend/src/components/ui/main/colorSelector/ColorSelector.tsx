"use client";

import Link from "next/link";
import { ColorSelectorProps } from "./ColorSelector.interfaces";

import Tooltip from "../tooltip/Tooltip";

export default function ColorSelector({
    productData,
}: Readonly<ColorSelectorProps>) {
    if (!productData.colors || !productData.colors.length) {
        return;
    }

    return (
        <div className="flex items-center gap-3 md:gap-5">
            <span className="min-w-max">Select color: </span>
            <div className="flex flex-wrap md:flex-nowrap items-center gap-3">
                {productData.colors.map((colorData) => (
                    <Tooltip key={colorData.id} message={colorData.colorName}>
                        <Link
                            href={`/catalog/${colorData.productSlug}`}
                            className={`p-1 ${
                                productData.slug === colorData.productSlug
                                    ? "outline outline-1 outline-black rounded-full pointer-events-none"
                                    : ""
                            }`}
                            tabIndex={
                                productData.slug === colorData.productSlug
                                    ? -1
                                    : undefined
                            }
                        >
                            <div
                                className="w-9 h-9 border border-gray-400 rounded-full"
                                style={{ backgroundColor: colorData.colorHex }}
                            ></div>
                        </Link>
                    </Tooltip>
                ))}
            </div>
        </div>
    );
}
