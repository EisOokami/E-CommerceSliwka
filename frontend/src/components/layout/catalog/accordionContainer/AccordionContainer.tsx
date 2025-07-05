"use client";

import { useCallback, useEffect, useState } from "react";
import useCatalogStore from "@/stores/catalog";
import {
    getFilteredProductsData,
    getFiltersByCategory,
    getProductsCategory,
    getProductsCount,
    getProductsPriceRange,
    getProductsData,
} from "@/data/loaders";
import {
    AccordionContainerProps,
    IAccordionItems,
    IFilterParams,
} from "./AccordionContainer.interfaces";
import { IProduct } from "@/interfaces/interfaces";

import Accordion from "@/components/ui/accordion/Accordion";
import AccordionSkeleton from "@/components/ui/accordion/AccordionSkeleton";

const limit = 9;

export default function AccordionContainer({
    setFilteredProducts,
}: Readonly<AccordionContainerProps>) {
    const currentPage = useCatalogStore((state) => state.currentPage);
    const setTotalPages = useCatalogStore((state) => state.setTotalPages);
    const setProductsCount = useCatalogStore((state) => state.setProductsCount);
    const productRating = useCatalogStore((state) => state.productRating);
    const searchValue = useCatalogStore((state) => state.searchValue);
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

    const buildFilterParams = useCallback(
        (
            selectedFilters: { [key: string]: string[] },
            productRating: string,
            searchValue: string,
        ): IFilterParams => {
            const params: IFilterParams = {
                search: null,
                category: null,
                price: null,
                colors: null,
                options: null,
                rating: null,
            };

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
                params.colors = selectedFilters.colors;
            }

            if (selectedFilters.options && selectedFilters.options.length) {
                params.options = selectedFilters.options;
            }

            if (selectedFilters.price) {
                params.price = selectedFilters.price.map((price) => +price);
            }

            return params;
        },
        [],
    );

    useEffect(() => {
        (async () => {
            const filterParams = buildFilterParams(
                selectedFilters,
                productRating,
                searchValue,
            );
            const { minPrice, maxPrice } = await getProductsPriceRange(
                filterParams.search,
                filterParams.category,
                null,
                null,
                null,
            );

            const productsCategory: IProduct[] = await getProductsCategory();

            const baseItems: IAccordionItems[] = [
                {
                    header: "Category",
                    content: [
                        ...new Set([
                            ...productsCategory
                                .map((product) => product.category.category)
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

            if (filterParams.category) {
                const filtersByCategory: IProduct[] =
                    await getFiltersByCategory(filterParams.category);

                baseItems.push(
                    {
                        header: "Colors",
                        content: [
                            ...new Set(
                                filtersByCategory.flatMap(
                                    (product) =>
                                        product.colors?.map(
                                            (color) => color.colorName,
                                        ) ?? [],
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
                                filtersByCategory.flatMap(
                                    (product) =>
                                        product.options?.map(
                                            (option) => option.value,
                                        ) ?? [],
                                ),
                            ),
                        ],
                        type: "checkbox",
                        setState: setSelectedFilters,
                    },
                );
            }

            setAccordionItems(baseItems);
        })();
    }, [
        selectedFilters.category,
        buildFilterParams,
        productRating,
        selectedFilters,
        searchValue,
    ]);

    useEffect(() => {
        (async () => {
            setIsProductLoading(true);

            const filterParams = buildFilterParams(
                selectedFilters,
                productRating,
                searchValue,
            );

            const { minPrice, maxPrice } = await getProductsPriceRange(
                filterParams.search,
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
                products?: IProduct[];
                totalPages?: number;
                productsCount?: number;
            } = {};

            const hasFilters = Object.values(updatedParams).some(
                (v) => v !== null,
            );

            if (hasFilters) {
                result = await getFilteredProductsData(
                    filterParams.search,
                    filterParams.category,
                    filterParams.price,
                    filterParams.colors,
                    filterParams.options,
                    filterParams.rating,
                    currentPage,
                    limit,
                );
            } else {
                const { products, totalPages } = await getProductsData(
                    currentPage,
                    limit,
                );
                const productsCount = await getProductsCount();

                result.products = products;
                result.totalPages = totalPages;
                result.productsCount = productsCount;
            }

            setFilteredProducts(result.products || []);
            setIsProductLoading(false);
            setIsAccordionLoading(false);
            setTotalPages(result.totalPages ?? 0);
            setProductsCount(result.productsCount ?? 0);
        })();
    }, [
        selectedFilters,
        productRating,
        currentPage,
        buildFilterParams,
        setFilteredProducts,
        setTotalPages,
        setProductsCount,
        searchValue,
        setIsProductLoading,
    ]);

    return (
        <section className="w-full">
            {isAccordionLoading ? (
                <AccordionSkeleton />
            ) : (
                <Accordion items={accordionItems} />
            )}
        </section>
    );
}
