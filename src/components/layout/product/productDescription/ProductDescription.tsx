"use client";

import { useState } from "react";
import { ProductDescriptionProps } from "./ProductDescription.interfaces";

export default function ProductDescription({
    descr,
    isShowMore = false,
}: Readonly<ProductDescriptionProps>) {
    const [showMore, setShowMore] = useState(false);

    return (
        <p className="text-gray-700">
            {showMore || !isShowMore ? descr : descr.slice(0, 250)}{" "}
            {isShowMore && (
                <a
                    className="text-black underline cursor-pointer"
                    onClick={() => setShowMore(!showMore)}
                >
                    {showMore ? "less..." : "more..."}
                </a>
            )}
        </p>
    );
}
