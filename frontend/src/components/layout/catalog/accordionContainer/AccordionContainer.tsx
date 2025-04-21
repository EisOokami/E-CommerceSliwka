"use client";

import { useEffect, useState } from "react";
import {
    getFilteredProductsData,
    getFiltersByCategory,
    getProductsCategory,
    getProductsCount,
    getProductsPriceRange,
    getStoreProductsData,
} from "@/data/loaders";
import {
    AccordionContainerProps,
    IAccordionItems,
    IFilterParams,
} from "./AccordionContainer.interfaces";
import { IStore } from "@/interfaces/interfaces";

import Accordion from "@/components/ui/accordion/Accordion";

export default function AccordionContainer({
    setFilteredProducts,
    productRating,
    limit,
    currentPage,
    totalPages,
    setTotalPages,
    productsCount,
    setProductsCount,
}: AccordionContainerProps) {
    const [accordionItems, setAccordionItems] = useState<IAccordionItems[]>([]);
    const [selectedFilters, setSelectedFilters] = useState<{
        [key: string]: string[];
    }>({
        category: ["All"],
        price: ["0", "Infinity"],
    });

    const buildFilterParams = (
        selectedFilters: { [key: string]: string[] },
        productRating: string,
    ): IFilterParams => {
        const params: IFilterParams = {
            category: null,
            price: null,
            colors: null,
            options: null,
            rating: null,
        };

        if (productRating !== "all" && productRating !== "DEFAULT") {
            params.rating = +productRating;
        }

        if (
            selectedFilters.category &&
            selectedFilters.category[selectedFilters.category.length - 1] !==
                "All"
        ) {
            params.category =
                selectedFilters.category[selectedFilters.category.length - 1];
        }

        if (selectedFilters.colors && selectedFilters.colors.length) {
            params.colors = selectedFilters.colors;
        }

        if (selectedFilters.options && selectedFilters.options.length) {
            params.options = selectedFilters.options;
        }

        if (selectedFilters.price) {
            params.price = selectedFilters.price.map((price) => +price);
        }

        return params;
    };

    useEffect(() => {
        (async () => {
            const filterParams = buildFilterParams(
                selectedFilters,
                productRating,
            );

            const { minPrice, maxPrice } = await getProductsPriceRange(
                filterParams.category,
                filterParams.colors,
                filterParams.options,
                filterParams.rating,
            );

            const updatedParams = {
                ...filterParams,
                price:
                    filterParams.price &&
                    (filterParams.price[0] === minPrice ||
                        filterParams.price[0] === 0) &&
                    (filterParams.price[1] === maxPrice ||
                        filterParams.price[1] === Infinity)
                        ? null
                        : filterParams.price,
            };

            let result: {
                products?: IStore[];
                totalPages?: number;
                productsCount?: number;
            } = {};

            if (Object.values(updatedParams).some((v) => v !== null)) {
                result = await getFilteredProductsData(
                    filterParams.category,
                    filterParams.price,
                    filterParams.colors,
                    filterParams.options,
                    filterParams.rating,
                    currentPage,
                    limit,
                );
            }

            if (Object.values(updatedParams).every((v) => v === null)) {
                const { products, totalPages } = await getStoreProductsData(
                    currentPage,
                    limit,
                );
                const productsCount = await getProductsCount();

                result.products = products;
                result.totalPages = totalPages;
                result.productsCount = productsCount;
            }

            const filtersByCategory: IStore[] = await getFiltersByCategory(
                filterParams.category,
            );
            const productsCategory: IStore[] = await getProductsCategory();

            const categoryAccordionItems: IAccordionItems[] = [
                {
                    header: "Category",
                    content: [
                        ...new Set([
                            ...productsCategory
                                .map(
                                    (productData) =>
                                        productData.category.category,
                                )
                                .sort(),
                            "All",
                        ]),
                    ],
                    type: "radio",
                    setState: setSelectedFilters,
                    defaultChecked: "All",
                },
                {
                    header: "Price",
                    content: [minPrice, maxPrice],
                    type: "range",
                    setState: setSelectedFilters,
                    rangeText: [`Min: $${minPrice}`, `Max: $${maxPrice}`],
                },
            ];

            if (
                selectedFilters.category[
                    selectedFilters.category.length - 1
                ] !== "All" &&
                !selectedFilters.length
            ) {
                categoryAccordionItems.push(
                    {
                        header: "Colors",
                        content: [
                            ...new Set(
                                filtersByCategory.flatMap((product) =>
                                    product.colors.map((option) => option.item),
                                ),
                            ),
                        ],
                        type: "checkbox",
                        setState: setSelectedFilters,
                    },
                    {
                        header: "Options",
                        content: [
                            ...new Set(
                                filtersByCategory.flatMap((product) =>
                                    product.options.map(
                                        (option) => option.item,
                                    ),
                                ),
                            ),
                        ],
                        type: "checkbox",
                        setState: setSelectedFilters,
                    },
                );
            }

            setAccordionItems(categoryAccordionItems);
            setFilteredProducts(result.products || []);
            setTotalPages(result.totalPages ?? 0);
            setProductsCount(result.productsCount ?? 0);
        })();
    }, [
        selectedFilters,
        setFilteredProducts,
        productRating,
        limit,
        currentPage,
        totalPages,
        setTotalPages,
        productsCount,
        setProductsCount,
    ]);

    return (
        <section className="w-full">
            <Accordion items={accordionItems} />
        </section>
    );
}
