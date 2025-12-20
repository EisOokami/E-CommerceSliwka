import React from "react";
import { ErrorPageProps } from "./ErrorPage.interfaces";

export default function ErrorPage({ message }: Readonly<ErrorPageProps>) {
    return (
        <html lang="en">
            <body className="flex flex-col">
                <main className="grid justify-items-center content-center mb-auto py-10 md:py-20 text-center">
                    <h3 className="font-bold text-xl md:text-4xl">
                        Oops! Something went wrong.
                    </h3>
                    <h3 className="font-bold text-xl md:text-4xl">
                        This is an error page. Please try again later.
                    </h3>
                    <h1 className="text-[200px] md:text-[300px] xl:text-[400px] font-bold text-gray-300">
                        404
                    </h1>
                    <p>{message}</p>
                </main>
            </body>
        </html>
    );
}
