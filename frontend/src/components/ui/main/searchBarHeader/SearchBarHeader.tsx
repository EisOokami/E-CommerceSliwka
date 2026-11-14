"use client";

import { memo, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useDebouncedCallback } from "use-debounce";
import { getProductsBySearchData } from "@/data/main/loaders";
import useClickOutside from "@/hooks/UseClickOutside";
import { IoIosSearch } from "react-icons/io";
import { IProduct } from "@/interfaces/interfaces";
import { SearchBarHeaderProps } from "./SearchBarHeader.interfaces";

import SearchItem from "../searchItem/SearchItem";

const SearchBarHeader = memo(function SearchBarHeader({
    handleCloseMenu,
}: Readonly<SearchBarHeaderProps>) {
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [products, setProducts] = useState<
        Omit<
            IProduct,
            | "wishlist"
            | "productOptions"
            | "sliderImages"
            | "colors"
            | "options"
            | "productInfo"
            | "productSpecs"
            | "detailedSpecifications"
        >[]
    >([]);
    const [searchError, setSearchError] = useState("");
    const requestVersion = useRef(0);
    const searchBarRef = useRef(null);
    const resultRef = useRef(null);

    useClickOutside(resultRef, () => handleCloseResult(), [searchBarRef]);

    const handleOpenResult = () => {
        setTimeout(() => setIsVisible(true), 10);
        setIsMounted(true);
    };

    const handleCloseResult = () => {
        setTimeout(() => setIsMounted(false), 500);
        setIsVisible(false);
    };

    const handleChangeInputValue = useDebouncedCallback(
        async (value: string, version: number) => {
            const trimmedValue = value.trim();

            if (!trimmedValue) {
                setProducts([]);

                return;
            }

            setSearchError("");

            try {
                const productsData =
                    await getProductsBySearchData(trimmedValue);

                if (version !== requestVersion.current) {
                    return;
                }

                setProducts(productsData);
                handleOpenResult();
            } catch {
                if (version === requestVersion.current) {
                    setSearchError("Search is unavailable. Please retry.");

                    handleOpenResult();
                }
            }
        },
        700,
    );

    useEffect(
        () => () => {
            requestVersion.current++;
            handleChangeInputValue.cancel();
        },
        [handleChangeInputValue],
    );

    return (
        <div
            className="relative"
            onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                    handleCloseResult();
                }
            }}
        >
            <div
                ref={searchBarRef}
                className="flex items-center gap-1 p-2 lg:p-3 text-xl bg-white border border-gray-200 rounded-lg"
            >
                <label htmlFor="searchBar">
                    <IoIosSearch className="text-2xl cursor-text" />
                </label>
                <input
                    id="searchBar"
                    type="text"
                    placeholder="Search"
                    className="placeholder:text-black outline-none ring-0"
                    onChange={(e) => {
                        requestVersion.current++;

                        setSearchError("");

                        if (!e.target.value.trim()) {
                            setProducts([]);
                        }

                        handleChangeInputValue(
                            e.target.value,
                            requestVersion.current,
                        );
                    }}
                    onFocus={handleOpenResult}
                />
            </div>
            {isMounted && (
                <div
                    ref={resultRef}
                    className={`absolute left-0 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 transition-all duration-200 ease-out ${
                        isVisible
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-95 pointer-events-none"
                    }`}
                >
                    {searchError ? (
                        <p role="alert" className="p-4">
                            {searchError}
                        </p>
                    ) : products.length > 0 ? (
                        <div className="py-2">
                            {products.slice(0, 5).map((productData) => (
                                <SearchItem
                                    key={productData.id}
                                    productData={productData}
                                    handleCloseResult={handleCloseResult}
                                    handleCloseMenu={handleCloseMenu}
                                />
                            ))}
                            {products.length > 5 && (
                                <Link
                                    href="/catalog"
                                    className="flex justify-center w-full py-2 font-medium cursor-pointer"
                                    onClick={handleCloseResult}
                                >
                                    Check for more
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="p-4 text-center">
                            <p className="text-gray-500">
                                No products found :(
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
});

export default SearchBarHeader;
