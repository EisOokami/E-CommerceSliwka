export interface CardProps {
    imageSrc: string;
    imageAlt: string;
    imageWidth: number | `${number}` | undefined;
    imageHeight: number | `${number}` | undefined;
    title: string;
    price: string;
    buttonHref: string;
    buttonTheme: "dark" | "light";
    buttonText: string;
    buttonInline?: boolean;
}
