"use client";

import { useState } from "react";
import Button from "@/components/ui/button/Button";
import { DetailsSpecsProps } from "./DetailsSpecs.interfaces";

export default function DetailsSpecs({ specsData }: DetailsSpecsProps) {
    const [showMore, setShowMore] = useState(false);

    return (
        <div className="grid gap-8">
            {specsData.map(({ title, specs }, i) => {
                return (
                    (showMore || i < 2) && (
                        <div key={i} className="grid gap-3">
                            <h6 className="text-lg md:text-2xl font-medium">
                                {title}
                            </h6>
                            <div className="grid gap-5">
                                {specs.map(({ name, value }, j) => (
                                    <article
                                        key={j}
                                        className="flex justify-between items-start pb-3 border-b"
                                    >
                                        <span className="w-1/3 font-medium">
                                            {name}
                                        </span>
                                        <div className="grid gap-2 w-2/3 text-right">
                                            {Array.isArray(value) ? (
                                                value.map((spec, k) => (
                                                    <span
                                                        key={k}
                                                        className="break-all"
                                                    >
                                                        {spec}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="break-words">
                                                    {value}
                                                </span>
                                            )}
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    )
                );
            })}
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
