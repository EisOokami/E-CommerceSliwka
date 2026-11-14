"use client";

import { useCallback, useEffect, useState } from "react";
import useCatalogStore from "@/stores/catalog";
import {
    getFilteredProductsData,
    getFiltersByCategory,
    getProductsCategory,
    getProductsPriceRange,
} from "@/data/main/loaders";
import {
    AccordionContainerProps,
    IAccordionItems,
    IFilterParams,
} from "./AccordionContainer.interfaces";

import Button from "@/components/ui/main/button/Button";
import Accordion from "@/components/ui/main/accordion/Accordion";
import AccordionSkeleton from "@/components/ui/main/accordion/AccordionSkeleton";

const limit = 9;

export default function AccordionContainer({
    setFilteredProducts,
}: Readonly<AccordionContainerProps>) {
    const setCurrentPage = useCatalogStore((state) => state.setCurrentPage);
    const currentPage = useCatalogStore((state) => state.currentPage);
    const setTotalPages = useCatalogStore((state) => state.setTotalPages);
    const setProductsCount = useCatalogStore((state) => state.setProductsCount);
    const productRating = useCatalogStore((state) => state.productRating);
    const searchValue = useCatalogStore((state) => state.searchValue);
    const sortValue = useCatalogStore((state) => state.sortValue);
    const setIsProductLoading = useCatalogStore(
        (state) => state.setIsProductLoading,
    );
    const [accordionItems, setAccordionItems] = useState<IAccordionItems[]>([]);
    const [selectedFilters, setSelectedFilters] = useState<{
        [key: string]: string[];
    }>({
        category: ["All"],
        price: ["0", "Infinity"],
    });
    const [isAccordionLoading, setIsAccordionLoading] = useState<boolean>(true);
    const [error, setError] = useState("");
    const [retry, setRetry] = useState(0);

    const buildFilterParams = useCallback(
        (
            selectedFilters: { [key: string]: string[] },
            productRating: string,
            searchValue: string,
        ): IFilterParams => {
            const params: IFilterParams = {};

            const keys = Object.keys(selectedFilters).filter(
                (key) =>
                    key !== "category" && key !== "price" && key !== "colors",
            );

            if (searchValue && searchValue.trim().length) {
                params.search = searchValue;
            }

            if (productRating !== "all" && productRating !== "DEFAULT") {
                params.rating = +productRating;
            }

            if (
                selectedFilters.category &&
                selectedFilters.category[
                    selectedFilters.category.length - 1
                ] !== "All"
            ) {
                params.category =
                    selectedFilters.category[
                        selectedFilters.category.length - 1
                    ];
            }

            if (selectedFilters.colors && selectedFilters.colors.length) {
                params.color = selectedFilters.colors;
            }

            if (selectedFilters.price) {
                params.price = selectedFilters.price.map((price) => +price);
            }

            keys.forEach((key) => {
                params[key] = selectedFilters[key];
            });

            return params;
        },
        [],
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [
        selectedFilters,
        productRating,
        searchValue,
        sortValue,
        setCurrentPage,
    ]);

    useEffect(() => {
        let active = true;

        setIsProductLoading(true);
        setError("");

        const params = buildFilterParams(
            selectedFilters,
            productRating,
            searchValue,
        );

        Promise.all([
            getFilteredProductsData(params, currentPage, limit, sortValue),
            getProductsPriceRange(params),
            getProductsCategory(),
            getFiltersByCategory(params.category ?? null),
        ])
            .then(([result, range, categories, filters]) => {
                if (!active) {
                    return;
                }

                const items: IAccordionItems[] = [
                    {
                        header: "Category",
                        content: [
                            ...new Set(
                                categories
                                    .map((item) => item.category.category)
                                    .sort(),
                            ),
                            "All",
                        ],
                        type: "radio",
                        setState: setSelectedFilters,
                        defaultChecked: "All",
                    },
                    {
                        header: "Price",
                        content: [range.minPrice, range.maxPrice],
                        type: "range",
                        setState: setSelectedFilters,
                        rangeText: [
                            `Min: $${range.minPrice}`,
                            `Max: $${range.maxPrice}`,
                        ],
                    },
                ];

                if (params.category) {
                    items.push(
                        {
                            header: "Colors",
                            content: filters.colors,
                            type: "checkbox",
                            setState: setSelectedFilters,
                        },
                        ...filters.options.map((option) => ({
                            header: option.title,
                            content: option.values,
                            type: "checkbox" as const,
                            setState: setSelectedFilters,
                        })),
                    );
                }

                setAccordionItems(items);
                setFilteredProducts(result.products);
                setTotalPages(result.totalPages);
                setProductsCount(result.productsCount);
            })
            .catch(() => {
                if (active) {
                    setError("Products could not be loaded. Please try again.");
                }
            })
            .finally(() => {
                if (active) {
                    setIsProductLoading(false);
                    setIsAccordionLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, [
        selectedFilters,
        productRating,
        currentPage,
        buildFilterParams,
        setFilteredProducts,
        setTotalPages,
        setProductsCount,
        searchValue,
        sortValue,
        setIsProductLoading,
        retry,
    ]);

    return (
        <section className="w-full">
            {error ? (
                <div
                    role="alert"
                    className="grid gap-4 rounded-lg border p-5 text-gray-700"
                >
                    <p>{error}</p>
                    <Button
                        text="Retry"
                        theme="dark"
                        inline
                        onClick={() => setRetry((value) => value + 1)}
                    />
                </div>
            ) : isAccordionLoading ? (
                <AccordionSkeleton />
            ) : (
                <Accordion items={accordionItems} />
            )}
        </section>
    );
}
