import { IProduct } from "@/interfaces/interfaces";

export interface CardsComponentProps {
    productsData: IProduct[];
}

export interface CardProps {
    productDocumentId: string;
    imageSrc: string;
    imageAlt: string;
    name: string;
    price: number;
    isDiscount: boolean;
    discountedPrice: number | null;
    averageRating: number;
    reviewsCount: number;
    quantity: number;
    inStock: boolean;
    buttonHref: string;
}
