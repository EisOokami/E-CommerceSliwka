import React from "react";

export default function CartItemSkeleton() {
    return (
        <div className="flex items-center gap-6 w-full min-h-48 px-3 py-8 border-t animate-pulse">
            <div className="size-20 lg:size-36 bg-gray-200 rounded-lg"></div>
            <div className="grid xl:flex justify-between items-center gap-4 w-full">
                <div className="md:flex-1 grid gap-2">
                    <div className="w-40 h-5 bg-gray-200 rounded"></div>
                    <div className="w-24 h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="grid sm:flex justify-start items-center gap-4 md:gap-6">
                    <div className="flex items-center gap-1">
                        <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                        <div className="w-10 h-8 bg-gray-200 rounded"></div>
                        <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                    </div>
                    <div className="flex justify-start items-center gap-2 md:gap-6">
                        <div className="w-20 h-6 bg-gray-200 rounded"></div>
                        <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
