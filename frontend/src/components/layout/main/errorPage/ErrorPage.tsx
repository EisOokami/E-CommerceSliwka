import { MdErrorOutline } from "react-icons/md";
import Button from "@/components/ui/main/button/Button";
import type { ErrorPageProps } from "./ErrorPage.interfaces";

export default function ErrorPage({
    message,
    onRetry,
}: Readonly<ErrorPageProps>) {
    return (
        <main className="container mx-auto grid flex-1 justify-items-center content-center gap-6 px-5 py-10 md:py-20 text-center">
            <MdErrorOutline className="text-8xl text-gray-300" />
            <h1 className="text-3xl md:text-4xl font-bold">
                Oops! Something went wrong.
            </h1>
            <p className="max-w-xl text-lg text-gray-500" role="alert">
                {message}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
                {onRetry && (
                    <Button text="Try again" theme="dark" onClick={onRetry} />
                )}
                <Button
                    text="Back to home"
                    theme="dark"
                    inline
                    isLink
                    href="/"
                />
            </div>
        </main>
    );
}
