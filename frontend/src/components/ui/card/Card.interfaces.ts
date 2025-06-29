import { IProduct } from "@/interfaces/interfaces";

export interface CardsComponentProps {
    productsData: IProduct[];
}

export interface CardProps {
    productDocumentId: string;
    imageSrc: string;
    imageAlt: string;
    imageWidth: number | `${number}`;
    imageHeight: number | `${number}`;
    title: string;
    price: number;
    isDiscount: boolean;
    discountedPrice: number | null;
    averageRating: number;
    reviewsCount: number;
    buttonHref: string;
    buttonTheme: "dark" | "light";
    buttonText: string;
    buttonInline?: boolean;
    buttonClassName?: string;
}
