"use client";

import { memo, useRef, useState } from "react";
import Link from "next/link";
import { useDebouncedCallback } from "use-debounce";
import { getProductsBySearchData } from "@/data/loaders";
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
    const [products, setProducts] = useState<IProduct[]>([]);
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

    const toggleMenu = () => {
        if (isVisible) {
            handleCloseResult();
        }

        if (!isVisible) {
            handleOpenResult();
        }
    };

    const handleChangeInputValue = useDebouncedCallback(async (value) => {
        const trimmedValue = value.trim();
        const isValid = /^[a-zA-Z0-9'",.\- ]+$/.test(trimmedValue);

        if (!trimmedValue || !isValid) {
            return;
        }

        const productsData: IProduct[] = await getProductsBySearchData(
            trimmedValue,
        );

        setProducts(productsData);
        handleOpenResult();
    }, 700);

    return (
        <div className="relative">
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
                    className="placeholder:text-black outline-none"
                    onChange={(e) => {
                        handleChangeInputValue(e.target.value);
                    }}
                    onFocus={toggleMenu}
                />
            </div>
            {isMounted && (
                <div
                    ref={resultRef}
                    className={`absolute left-0 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 transition-all duration-200 ease-out ${
                        isVisible
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-95 pointer-events-none"
                    }`}
                >
                    {products.length > 0 ? (
                        <div className="py-2">
                            {products.slice(0, 5).map((productData) => (
                                <SearchItem
                                    key={productData.documentId}
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
