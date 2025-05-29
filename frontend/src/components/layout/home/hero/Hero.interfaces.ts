import { IImage, IProduct } from "@/interfaces/interfaces";

export interface HeroProps {
    id: number;
    documentId: string;
    __component: string;
    heading: string;
    subHeading: string;
    image: IImage;
    product: IProduct;
}
