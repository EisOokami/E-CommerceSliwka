"use client";

import { useRef, useState } from "react";
import useCatalogStore from "@/stores/catalog";
import useClickOutside from "@/hooks/UseClickOutside";
import { IoChevronDown } from "react-icons/io5";

const options = [
    { label: "All", value: "all" },
    { label: "5.0", value: "5.0" },
    { label: "Above 4.8", value: "4.8" },
    { label: "Above 4.5", value: "4.5" },
    { label: "Above 4.0", value: "4.0" },
    { label: "Below 4.0", value: "0.0" },
];

export default function RatingSelect() {
    const setProductRating = useCatalogStore((state) => state.setProductRating);
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [selectedValue, setSelectedValue] = useState("By rating");
    const selectRef = useRef<HTMLUListElement>(null);
    const btnRef = useRef<HTMLButtonElement>(null);

    useClickOutside(selectRef, () => handleCloseList(), [btnRef]);

    const handleOpenList = () => {
        setTimeout(() => setIsVisible(true), 10);
        setIsMounted(true);
    };

    const handleCloseList = () => {
        setTimeout(() => setIsMounted(false), 200);
        setIsVisible(false);
    };

    const toggleList = () => {
        if (isVisible) {
            handleCloseList();
        }

        if (!isVisible) {
            handleOpenList();
        }
    };

    const handleUpdateProductRating = (value: string, label: string) => {
        setProductRating(value);
        setSelectedValue(label);
        handleCloseList();
    };

    return (
        <div className="relative w-full md:w-52">
            <button
                ref={btnRef}
                className="flex justify-between items-center w-full px-4 py-2 text-left outline outline-1 outline-[#e5e7eb] rounded-md"
                onClick={toggleList}
            >
                {selectedValue}
                <IoChevronDown />
            </button>
            {isMounted && (
                <ul
                    ref={selectRef}
                    className={`absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow-md z-50 transition-all duration-200 ease-out ${
                        isVisible
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-90"
                    }`}
                >
                    {options.map((option) => (
                        <li
                            key={option.value}
                            onClick={() =>
                                handleUpdateProductRating(
                                    option.value,
                                    option.label,
                                )
                            }
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition"
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
