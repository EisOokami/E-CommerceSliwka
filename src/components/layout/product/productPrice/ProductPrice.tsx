import { ProductPriceProps } from "./ProductPrice.interfaces";

export default function ProductPrice({
    price,
    isDiscount,
    discount,
}: Readonly<ProductPriceProps>) {
    return (
        <div className="flex items-center gap-5">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold">
                ${price}
            </h1>
            {isDiscount ? (
                <h1 className="text-xl md:text-2xl lg:text-3xl text-gray-500 font-semibold line-through">
                    ${discount}
                </h1>
            ) : null}
        </div>
    );
}
