import { IProduct } from "@/interfaces/interfaces";

export interface CardsComponentProps {
    productsData: IProduct[];
}

export interface CardProps
    extends Pick<
        IProduct,
        | "name"
        | "price"
        | "isDiscount"
        | "discountedPrice"
        | "averageRating"
        | "quantity"
        | "inStock"
    > {
    productDocumentId: string;
    imageSrc: string;
    imageAlt: string;
    reviewsCount: number;
    buttonHref: string;
}
