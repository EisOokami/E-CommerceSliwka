"use client";

import useProductStore from "@/stores/product";
import { ProductPriceProps } from "./ProductPrice.interfaces";

export default function ProductPrice({
    price,
    isDiscount,
    discount,
    colorsData,
    optionsData,
}: Readonly<ProductPriceProps>) {
    const selectedOption = useProductStore((state) => state.selectedOption);
    const selectedColor = useProductStore((state) => state.selectedColor);
    const optionPrice =
        optionsData && optionsData.length && optionsData.length > selectedOption
            ? optionsData[selectedOption].priceDifference
            : 0;
    const colorPrice =
        colorsData && colorsData.length && colorsData.length > selectedColor
            ? colorsData[selectedColor].priceDifference
            : 0;

    return (
        <div className="flex items-center gap-5">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold">
                $
                {isDiscount && discount
                    ? discount + colorPrice + optionPrice
                    : price + colorPrice + optionPrice}
            </h1>
            {isDiscount ? (
                <h1 className="text-xl md:text-2xl lg:text-3xl text-gray-500 font-semibold line-through">
                    ${price + colorPrice + optionPrice}
                </h1>
            ) : null}
        </div>
    );
}
