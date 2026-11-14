export interface InlineButtonProps {
    href?: string;
    theme: "light" | "dark";
    text: string;
    inline?: boolean;
    className?: string;
    isLink?: boolean;
    onClick?: () => void;
    type?: "button" | "reset" | "submit";
    isLoading?: boolean;
    spinnerClassName?: string;
    tabIndex?: number;
}
