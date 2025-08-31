import { memo } from "react";

const CardSkeleton = memo(function CardSkeleton() {
    return (
        <div className="relative grid justify-items-center gap-1 min-h-80 xl:min-h-[500px] max-h-[500px] px-1 py-3 md:p-8 bg-white border border-gray-200 rounded-3xl transition animate-pulse">
            <div className="absolute top-3 right-3 z-10">
                <div className="size-12 bg-gray-200 rounded-full"></div>
            </div>
            <div className="grid place-content-center">
                <div className="size-28 sm:size-36 lg:size-40 xl:size-60 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="grid justify-items-center gap-1 md:gap-3 w-full">
                <div className="grid justify-items-center gap-1 w-full">
                    <div className="w-24 md:w-full h-5 xl:h-8 bg-gray-200 rounded-lg"></div>
                    <div className="w-20 md:w-24 xl:w-36 h-6 bg-gray-200 rounded-lg"></div>
                </div>
                <div className="grid content-end justify-items-center gap-2">
                    <div className="w-20 md:w-28 h-6 md:h-8 bg-gray-200 rounded-lg"></div>
                    <div className="w-20 md:w-28 h-6 md:h-8 bg-gray-200 rounded-lg"></div>
                    <div className="w-24 md:w-32 h-10 md:h-14 bg-gray-200 rounded-lg"></div>
                </div>
            </div>
        </div>
    );
});

export default CardSkeleton;
