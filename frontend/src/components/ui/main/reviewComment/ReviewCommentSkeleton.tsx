export default function ReviewCommentSkeleton() {
    return (
        <article className="flex items-start gap-3 md:gap-5 p-3 md:p-5 bg-gray-100 rounded-xl animate-pulse">
            <div className="w-14 h-14">
                <div className="w-14 h-14 bg-gray-300 rounded-full"></div>
            </div>
            <div className="grid gap-2 w-full">
                <div className="flex justify-between items-start">
                    <div className="grid gap-2">
                        <div className="w-32 h-5 md:h-6 bg-gray-300 rounded"></div>
                        <div className="flex gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="w-4 md:w-5 h-4 md:h-5 bg-gray-300 rounded"
                                ></div>
                            ))}
                        </div>
                        <div className="w-20 h-3 bg-gray-200 rounded md:hidden"></div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="hidden md:block w-24 h-3 bg-gray-200 rounded"></div>
                        <div className="hidden md:flex gap-2">
                            <div className="w-5 h-5 bg-gray-300 rounded"></div>
                            <div className="w-5 h-5 bg-gray-300 rounded"></div>
                        </div>
                    </div>
                </div>
                <div className="grid gap-2">
                    <div className="w-full h-3 bg-gray-200 rounded"></div>
                    <div className="w-5/6 h-3 bg-gray-200 rounded"></div>
                    <div className="w-4/6 h-3 bg-gray-200 rounded"></div>
                </div>
                <div className="flex flex-wrap gap-3 mt-2">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div
                            key={i}
                            className="w-20 md:w-32 h-16 md:h-24 bg-gray-300 rounded-xl"
                        ></div>
                    ))}
                </div>
            </div>
        </article>
    );
}
