interface InlineButtonProps {
    theme: "light" | "dark";
    text: string;
    inline?: boolean;
}

export default function Button({
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
        <button className={`w-fit px-10 py-3 border rounded-md ${styleTheme}`}>
            {text}
        </button>
    );
}
