"use client";

import { useEffect } from "react";

export default function Error({
    error,
}: {
    error: Error & { digest?: string };
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="w-full h-svh pb-32 grid justify-items-center content-center text-center">
            <h3 className="font-bold text-xl md:text-4xl">
                Oops! Something went wrong.
            </h3>
            <h3 className="font-bold text-xl md:text-4xl">
                This is an error page. Please try again later.
            </h3>
            <h1 className="text-[200px] md:text-[300px] xl:text-[400px] font-bold text-gray-300">
                404
            </h1>
        </div>
    );
}
