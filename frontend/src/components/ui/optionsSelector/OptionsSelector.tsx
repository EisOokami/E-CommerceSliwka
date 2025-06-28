"use client";

import { useEffect } from "react";
import useProductStore from "@/stores/product";
import { OptionsSelectorProps } from "./OptionsSelector.interfaces";

export default function OptionsSelector({
    optionsData,
}: Readonly<OptionsSelectorProps>) {
    const setOptionDocumentId = useProductStore(
        (state) => state.setOptionDocumentId,
    );
    const selectedOption = useProductStore((state) => state.selectedOption);
    const setSelectedOption = useProductStore(
        (state) => state.setSelectedOption,
    );

    useEffect(() => {
        if (optionsData && optionsData.length) {
            setSelectedOption(0);
            setOptionDocumentId(optionsData[0].documentId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!optionsData || !optionsData.length) {
        return null;
    }

    const handleSelectedOption = (index: number, documentIdOption: string) => {
        setSelectedOption(index);
        setOptionDocumentId(documentIdOption);
    };

    return (
        <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-2 md:gap-3">
            {optionsData.map((option, i) => (
                <button
                    key={option.documentId}
                    className={`text-center w-full py-3 border rounded-xl ${
                        selectedOption === i
                            ? "border-black text-black"
                            : "text-gray-600"
                    }`}
                    onClick={() => handleSelectedOption(i, option.documentId)}
                    disabled={option.isStock}
                >
                    {option.value}
                </button>
            ))}
        </div>
    );
}
