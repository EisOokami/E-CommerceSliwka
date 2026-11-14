"use client";

import { LuSearch } from "react-icons/lu";
import { SearchInputProps } from "./SearchInput.interfaces";

export default function SearchInput({
    placeholder,
}: Readonly<SearchInputProps>) {
    return (
        <div className="relative">
            <LuSearch
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
                type="text"
                placeholder={placeholder || "Search..."}
                className="h-8 pl-8 pr-3 text-xs bg-gray-50 border border-gray-200 rounded-md w-56 placeholder:text-gray-400 text-black focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
            />
        </div>
    );
}
