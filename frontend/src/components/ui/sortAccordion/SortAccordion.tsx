"use client";

import useCatalogStore from "@/stores/catalog";

import AccordionItem from "../accordion/AccordionItem";

const sortOptions = [
    { label: "Quantity (high → low)", value: ["quantity:desc"] },
    { label: "In stock first", value: ["inStock:desc"] },
    { label: "Rating (high → low)", value: ["averageRating:desc"] },
    { label: "Name (A → Z)", value: ["name:asc"] },
    { label: "Name (Z → A)", value: ["name:desc"] },
];

export default function SortAccordion() {
    const sortValue = useCatalogStore((state) => state.sortValue);
    const setSortValue = useCatalogStore((state) => state.setSortValue);

    const handleSort = (sortValueArg: string[]) => {
        if (sortValueArg[0] === sortValue[0]) {
            setSortValue([]);

            return;
        }

        setSortValue(sortValueArg);
    };

    return (
        <AccordionItem header="Sort">
            <div className="grid gap-2">
                {sortOptions.map((option) => (
                    <button
                        key={option.label}
                        onClick={() => handleSort(option.value)}
                        className={`w-full text-left px-4 py-2 rounded-lg border transition-all duration-200
                                ${
                                    sortValue[0] === option.value[0]
                                        ? "bg-black text-white shadow-md border-black"
                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:shadow-sm"
                                }
                `}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </AccordionItem>
    );
}
