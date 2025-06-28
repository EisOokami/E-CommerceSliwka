"use client";

import { useEffect } from "react";
import useProductStore from "@/stores/product";
import { IImage } from "@/interfaces/interfaces";
import { ColorSelectorProps } from "./ColorSelector.interfaces";

import Tooltip from "../tooltip/Tooltip";

export default function ColorSelector({
    colorsData,
}: Readonly<ColorSelectorProps>) {
    const setColorDocumentId = useProductStore(
        (state) => state.setColorDocumentId,
    );
    const selectedColor = useProductStore((state) => state.selectedColor);
    const setSelectedColor = useProductStore((state) => state.setSelectedColor);
    const setColorSliderImages = useProductStore(
        (state) => state.setColorSliderImages,
    );

    useEffect(() => {
        if (colorsData && colorsData.length) {
            setSelectedColor(0);
            setColorDocumentId(colorsData[0].documentId);
            setColorSliderImages(colorsData[0].sliderImages);
        }

        if (colorsData && !colorsData.length) {
            setSelectedColor(0);
            setColorDocumentId("");
            setColorSliderImages(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!colorsData || !colorsData.length) {
        return null;
    }

    const handleSelectedColor = (
        index: number,
        documentIdColor: string,
        sliderImages: IImage[],
    ) => {
        setSelectedColor(index);
        setColorDocumentId(documentIdColor);
        setColorSliderImages(sliderImages);
    };

    return (
        <div className="flex items-center gap-5">
            <span>Select color: </span>
            <div className="flex items-center gap-3">
                {colorsData.map((color, i) => (
                    <Tooltip key={color.documentId} message={color.colorName}>
                        <div
                            className={`p-1 ${
                                selectedColor === i
                                    ? "outline outline-1 outline-black rounded-full"
                                    : ""
                            }`}
                        >
                            <button
                                className="block w-9 h-9 border border-gray-400 rounded-full"
                                style={{ backgroundColor: color.colorHex }}
                                onClick={() =>
                                    handleSelectedColor(
                                        i,
                                        color.documentId,
                                        color.sliderImages,
                                    )
                                }
                            />
                        </div>
                    </Tooltip>
                ))}
            </div>
        </div>
    );
}
