import { IProduct } from "@/interfaces/interfaces";

export interface CardsComponentProps {
    productsData: IProduct[];
}

export interface CardProps {
    productDocumentId: string;
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
    buttonClassName?: string;
}
