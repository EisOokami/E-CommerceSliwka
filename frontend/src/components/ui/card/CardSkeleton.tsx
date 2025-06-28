import { memo } from "react";
import Image from "next/image";

const CardSkeleton = memo(function CardSkeleton() {
    return (
        <div className="relative grid justify-items-center gap-1 min-h-80 xl:min-h-[500px] max-h-[500px] px-1 py-3 md:p-8 bg-white border border-gray-200 rounded-3xl transition animate-pulse">
            <div className="absolute top-3 right-3 z-10">
                <div className="size-12 bg-gray-200 rounded-full"></div>
            </div>
            <div className="grid place-items-start w-full">
                <div className="grid place-content-center w-full">
                    <Image
                        src="/skeleton-loader.png"
                        alt="skeleton-loader"
                        width={300}
                        height={300}
                        className="size-32 sm:size-48 xl:size-64 object-contain rounded-lg"
                    />
                </div>
            </div>
            <div className="grid justify-items-center gap-1 md:gap-3 w-full">
                <div className="grid justify-items-center gap-1 w-full">
                    <div className="w-32 md:w-40 h-5 bg-gray-100 rounded-lg"></div>
                    <div className="w-32 md:w-48 h-5 bg-gray-100 rounded-lg"></div>
                </div>
                <div className="grid content-end justify-items-center gap-2">
                    <div className="w-28 h-6 md:h-8 bg-gray-100 rounded-lg"></div>
                    <div className="w-28 h-6 md:h-8 bg-gray-100 rounded-lg"></div>
                    <div className="w-32 h-14 bg-gray-100 rounded-lg"></div>
                </div>
            </div>
        </div>
    );
});

export default CardSkeleton;
