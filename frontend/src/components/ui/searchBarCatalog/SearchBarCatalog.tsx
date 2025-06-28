"use client";

import { memo } from "react";
import useCatalogStore from "@/stores/catalog";
import { useDebouncedCallback } from "use-debounce";
import { IoIosSearch } from "react-icons/io";

const SearchBarCatalog = memo(function SearchBarCatalog() {
    const setSearchValue = useCatalogStore((state) => state.setSearchValue);

    const handleChangeInputValue = useDebouncedCallback(async (value) => {
        const trimmedValue = value.trim();
        const isValid = /^[a-zA-Z0-9'",.\- ]+$/.test(trimmedValue);

        if (!trimmedValue || !isValid) {
            setSearchValue("");
            return;
        }

        setSearchValue(trimmedValue);
    }, 700);

    return (
        <div className="relative">
            <div className="flex items-center gap-1 p-3 md:p-2 lg:p-3 text-xl md:text-base lg:text-xl bg-white border border-gray-200 rounded-lg">
                <label htmlFor="searchBarCatalog">
                    <IoIosSearch className="text-2xl md:text-xl lg:text-2xl cursor-text" />
                </label>
                <input
                    id="searchBarCatalog"
                    type="text"
                    placeholder="Search"
                    className="w-full placeholder:text-black outline-none"
                    onChange={(e) => {
                        handleChangeInputValue(e.target.value);
                    }}
                />
            </div>
        </div>
    );
});

export default SearchBarCatalog;
