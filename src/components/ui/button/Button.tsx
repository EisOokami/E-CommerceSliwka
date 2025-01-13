import { InlineButtonProps } from "./Button.interfaces";

export default function Button({
    href,
    theme,
    text,
    inline = false,
}: InlineButtonProps) {
    const styleTheme =
        theme === "dark" && inline
            ? "hover:text-white hover:bg-black border-black transition"
            : theme === "dark" && !inline
            ? "text-white hover:text-black bg-black hover:bg-white border-black transition"
            : "text-white hover:text-black hover:bg-white border-white transition";

    return (
        <a
            href={href}
            className={`w-fit px-10 py-3 border rounded-md ${styleTheme}`}
        >
            {text}
        </a>
    );
}
