import React from "react";

export default function CategoriesCarouselSkeleton() {
    return (
        <div className="grid gap-7 container mx-auto p-3 md:p-0 animate-pulse">
            <div className="flex justify-between items-center">
                <div className="w-44 md:w-64 h-7 md:h-9 bg-gray-300 rounded"></div>
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-gray-300 rounded-full"></div>
                    <div className="w-9 h-9 bg-gray-300 rounded-full"></div>
                </div>
            </div>
            <div className="overflow-hidden">
                <div className="flex gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="flex flex-col items-center gap-2 w-full p-3 md:p-5 bg-gray-200 rounded-xl"
                        >
                            <div className="w-10 md:w-14 h-10 md:h-14 bg-gray-300 rounded-lg"></div>
                            <div className="w-16 md:w-24 h-4 bg-gray-300 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
