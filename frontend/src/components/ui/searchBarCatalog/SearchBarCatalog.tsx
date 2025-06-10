"use client";

import useCatalogStore from "@/stores/catalog";
import { useDebouncedCallback } from "use-debounce";
import { IoIosSearch } from "react-icons/io";

export default function SearchBarCatalog() {
    const setSearchValue = useCatalogStore((state) => state.setSearchValue);

    const handleChangeInputValue = useDebouncedCallback(async (value) => {
        const trimmedValue = value.trim();
        const isValid = /^[a-zA-Z0-9'",.\- ]+$/.test(trimmedValue);

        if (!trimmedValue || !isValid) {
            return;
        }

        setSearchValue(trimmedValue);
    }, 700);

    return (
        <div className="relative">
            <div className="flex items-center gap-1 p-2 lg:p-3 text-xl text-gray-400 bg-gray-100 rounded-md">
                <label htmlFor="searchBarCatalog">
                    <IoIosSearch className="text-2xl cursor-text" />
                </label>
                <input
                    id="searchBarCatalog"
                    type="text"
                    placeholder="Search"
                    className="bg-gray-100 outline-none"
                    onChange={(e) => {
                        handleChangeInputValue(e.target.value);
                    }}
                />
            </div>
        </div>
    );
}
