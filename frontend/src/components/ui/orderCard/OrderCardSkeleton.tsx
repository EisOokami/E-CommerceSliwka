export default function OrderCardSkeleton() {
    return (
        <div className="text-left w-full bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden animate-pulse">
            <div className="p-6">
                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="space-y-2">
                            <div className="w-48 md:w-64 h-5 bg-gray-200 rounded"></div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                                <div className="w-24 h-4 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                        <div className="w-28 h-6 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="text-right space-y-1">
                            <div className="w-10 h-3 bg-gray-200 rounded ml-auto"></div>
                            <div className="w-20 h-6 bg-gray-200 rounded ml-auto"></div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-4">
                    <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-gray-200 rounded"></div>
                        <div className="w-16 h-4 bg-gray-200 rounded"></div>
                    </div>
                    <div className="w-28 h-4 bg-gray-200 rounded"></div>
                    <div className="w-32 h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <div className="w-20 h-4 bg-gray-200 rounded"></div>
                </div>
            </div>
        </div>
    );
}
