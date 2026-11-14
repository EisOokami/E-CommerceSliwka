"use client";

import { MdErrorOutline } from "react-icons/md";

import Button from "@/components/ui/main/button/Button";

export default function ErrorPage() {
    return (
        <main className="grid place-content-center container mx-auto mb-auto px-3 py-10 md:px-5">
            <section className="grid place-content-center justify-items-center gap-5 max-w-[500px] py-20">
                <div className="w-min p-5 bg-red-500 rounded-full shadow-md">
                    <MdErrorOutline className="text-7xl text-white" />
                </div>
                <h1 className="text-4xl font-bold text-gray-800">
                    Something went wrong
                </h1>
                <p className="text-lg text-center text-gray-600">
                    An unexpected error occurred. Please try again later or
                    return to the homepage.
                </p>
                <div className="flex gap-5">
                    <Button href="/" text="Go Home" theme="dark" isLink />
                    <Button
                        href="/"
                        text="Contact Support"
                        theme="dark"
                        inline
                        isLink
                    />
                </div>
            </section>
        </main>
    );
}
