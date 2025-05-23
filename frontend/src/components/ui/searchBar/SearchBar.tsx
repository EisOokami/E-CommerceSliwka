"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useDebouncedCallback } from "use-debounce";
import { getProductsBySearchData } from "@/data/loaders";
import useClickOutside from "@/hooks/UseClickOutside";
import { IoIosSearch } from "react-icons/io";
import { IProduct } from "@/interfaces/interfaces";
import { SearchBarProps } from "./SearchBar.interfaces";

import SearchItem from "../searchItem/SearchItem";

export default function SearchBar({ setIsOpenMenu }: SearchBarProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [products, setProducts] = useState<IProduct[]>([]);
    const searchBarRef = useRef(null);
    const resultRef = useRef(null);

    useClickOutside(
        resultRef,
        () => {
            setIsOpen(false);
        },
        [searchBarRef],
    );

    const handleChangeInputValue = useDebouncedCallback(async (value) => {
        if (!value.trim()) {
            return;
        }

        const productsData: IProduct[] = await getProductsBySearchData(value);

        setProducts(productsData);
        setIsOpen(true);
    }, 700);

    return (
        <div className="relative">
            <div
                ref={searchBarRef}
                className="flex items-center gap-1 p-2 lg:p-3 text-xl text-gray-400 bg-gray-100 rounded-md"
            >
                <label htmlFor="searchBar">
                    <IoIosSearch className="text-2xl cursor-text" />
                </label>
                <input
                    id="searchBar"
                    type="text"
                    placeholder="Search"
                    className="bg-gray-100 outline-none"
                    onChange={(e) => {
                        handleChangeInputValue(e.target.value);
                    }}
                    onFocus={() => setIsOpen(true)}
                />
            </div>
            {isOpen && (
                <div
                    ref={resultRef}
                    className="absolute left-0 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg z-50"
                >
                    {products.length > 0 ? (
                        <div className="max-h-96 overflow-auto py-2">
                            {products.slice(0, 5).map((productData) => (
                                <SearchItem
                                    key={productData.documentId}
                                    productData={productData}
                                    setIsOpen={setIsOpen}
                                    setIsOpenMenu={setIsOpenMenu}
                                />
                            ))}
                            {products.length > 5 && (
                                <Link
                                    href="/catalog"
                                    className="flex justify-center w-full py-2 font-medium cursor-pointer"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Check for more
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="p-4 text-center text-gray-500">
                            No products found :(
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
