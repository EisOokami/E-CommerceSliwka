export default function WishlistItemSkeleton() {
    return (
        <div className="transition-all duration-300 ease-out opacity-100 scale-100">
            <div className="p-3 bg-white rounded-lg shadow-sm animate-pulse overflow-hidden">
                <div className="md:flex">
                    <div className="flex justify-center md:w-1/4 h-48 md:h-auto">
                        <div className="w-60 h-full bg-gray-200 rounded-lg"></div>
                    </div>
                    <div className="flex flex-col md:w-3/4 p-4 md:p-6">
                        <div className="block flex-1 space-y-2">
                            <div className="w-full md:w-96 h-6 bg-gray-200 rounded"></div>
                            <div className="w-24 h-4 bg-gray-200 rounded"></div>
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="w-6 h-6 bg-gray-200 rounded"
                                        ></div>
                                    ))}
                                </div>
                                <div className="w-8 h-4 bg-gray-200 rounded"></div>
                            </div>
                            <div className="space-y-2">
                                <div className="w-full h-3 bg-gray-200 rounded"></div>
                                <div className="w-5/6 h-3 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                        <div className="grid md:flex items-center justify-between gap-3 md:gap-0 mt-4 pt-4 border-t border-gray-100">
                            <div className="w-20 md:w-28 h-6 bg-gray-200 rounded"></div>
                            <div className="flex flex-row-reverse md:flex-row items-center gap-2 md:gap-0 md:space-x-2">
                                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                                <div className="w-32 h-12 bg-gray-300 rounded-lg"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
