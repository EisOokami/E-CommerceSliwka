"use client";

import { memo, useState } from "react";
import { ProductDescriptionProps } from "./ProductDescription.interfaces";

const ProductDescription = memo(function ProductDescription({
    descr,
    isShowMore = false,
}: Readonly<ProductDescriptionProps>) {
    const [showMore, setShowMore] = useState(false);

    return (
        <p className="text-gray-700">
            {showMore || !isShowMore ? descr : descr.slice(0, 250)}{" "}
            {isShowMore && descr.length > 250 && (
                <button
                    className="text-black underline cursor-pointer"
                    onClick={() => setShowMore(!showMore)}
                >
                    {showMore ? "less..." : "more..."}
                </button>
            )}
        </p>
    );
});

export default ProductDescription;
