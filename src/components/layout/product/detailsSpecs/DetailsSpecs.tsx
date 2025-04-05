"use client";

import { useState } from "react";
import { DetailsSpecsProps } from "./DetailsSpecs.interfaces";

import Button from "@/components/ui/button/Button";

export default function DetailsSpecs({
    specsData,
}: Readonly<DetailsSpecsProps>) {
    const [showMore, setShowMore] = useState(false);

    return (
        <div className="grid gap-8">
            {specsData.map(
                (specData, i) =>
                    (showMore || i < 2) && (
                        <div key={specData.id} className="grid gap-3">
                            <h6 className="text-lg md:text-2xl font-medium">
                                {specData.name}
                            </h6>
                            <div className="grid gap-5">
                                {specData.specifications.map(
                                    (detailedSpecification) => (
                                        <article
                                            key={detailedSpecification.id}
                                            className="flex justify-between items-start pb-3 border-b"
                                        >
                                            <span className="w-1/3 font-medium">
                                                {detailedSpecification.name}
                                            </span>
                                            <div className="grid gap-2 w-2/3 text-right">
                                                {detailedSpecification.specifications.map(
                                                    (specification) => (
                                                        <span
                                                            key={
                                                                specification.id
                                                            }
                                                            className="break-all"
                                                        >
                                                            {specification.item}
                                                        </span>
                                                    ),
                                                )}
                                            </div>
                                        </article>
                                    ),
                                )}
                            </div>
                        </div>
                    ),
            )}
            <div className="w-full text-center">
                <Button
                    text={showMore ? "View less" : "View more"}
                    theme="dark"
                    inline
                    onClick={() => setShowMore(!showMore)}
                />
            </div>
        </div>
    );
}
