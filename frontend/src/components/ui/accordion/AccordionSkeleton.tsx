export default function AccordionSkeleton() {
    return (
        <div className="w-full h-full bg-white animate-pulse">
            <div className="grid gap-6 container mx-auto">
                <div className="w-full">
                    <div className="py-[1.3rem] md:py-7 bg-gray-200 rounded-lg"></div>
                </div>
                <div className="hidden md:grid gap-3 w-full">
                    {[...Array(2)].map((_, i) => (
                        <div
                            key={i}
                            className="py-7 bg-gray-200 rounded-lg"
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
}
