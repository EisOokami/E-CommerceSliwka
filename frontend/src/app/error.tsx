"use client";

import { useEffect } from "react";

export default function Error({
    error,
}: Readonly<{
    error: Error & { digest?: string };
}>) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="grid justify-items-center content-center mb-auto py-10 md:py-20 text-center">
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
