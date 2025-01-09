interface InlineButtonProps {
    theme: "light" | "dark";
    text: string;
}

export default function InlineButton({ theme, text }: InlineButtonProps) {
    const styleTheme =
        theme === "dark"
            ? "hover:text-white hover:bg-black border-black transition"
            : "text-white hover:text-black hover:bg-white border-white transition";

    return (
        <button className={`w-fit px-10 py-3 border rounded-md ${styleTheme}`}>
            {text}
        </button>
    );
}
