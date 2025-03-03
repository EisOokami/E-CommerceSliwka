"use client";

import { useState } from "react";
import { StorageSelectorProps } from "./StorageSelector.interfaces";

export default function StorageSelector({
    storageData,
}: Readonly<StorageSelectorProps>) {
    const [selectedStorage, setSelectedStorage] = useState(0);

    return (
        <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-2 md:gap-3">
            {storageData.map((storage, i) => (
                <button
                    key={i}
                    className={`text-center w-full py-3 border rounded-xl ${
                        selectedStorage === i
                            ? "border-black text-black"
                            : "text-gray-600"
                    }`}
                    onClick={() => setSelectedStorage(i)}
                >
                    {storage}
                </button>
            ))}
        </div>
    );
}
