import { memo } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { InlineButtonProps } from "./Button.interfaces";

const Button = memo(function Button({
    href = "",
    theme,
    text,
    inline = false,
    className = "",
    isLink = false,
    onClick,
    type = "button",
    isLoading = false,
    spinnerClassName = "",
    tabIndex,
}: Readonly<InlineButtonProps>) {
    const styleTheme =
        theme === "dark" && inline
            ? "text-black hover:bg-gray-100 border-black transition"
            : theme === "dark" && !inline
            ? "text-white bg-black hover:bg-gray-900 border-black focus:outline-offset-4 focus:outline-gray-500 transition"
            : "text-white hover:bg-white/20 border-white focus:outline-white transition";

    return (
        <>
            {isLink ? (
                <Link
                    href={href}
                    className={twMerge(
                        `w-fit px-10 py-3 text-sm md:text-base text-center border rounded-md ${styleTheme} ${className}`,
                    )}
                    tabIndex={tabIndex}
                >
                    {text}
                </Link>
            ) : (
                <button
                    onClick={onClick}
                    className={twMerge(
                        `w-fit px-10 py-3 text-sm md:text-base border rounded-md ${styleTheme} ${className} ${
                            isLoading
                                ? "flex justify-center items-center gap-1"
                                : ""
                        }`,
                    )}
                    type={type}
                    disabled={isLoading}
                    tabIndex={tabIndex}
                >
                    {text}
                    {isLoading ? (
                        <svg
                            className={twMerge(
                                `animate-spin h-5 w-5 ${spinnerClassName}`,
                            )}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                    ) : null}
                </button>
            )}
        </>
    );
});

export default Button;
