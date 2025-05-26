import { IImage, IProduct } from "@/interfaces/interfaces";

export interface FeatureProduct {
    id: number;
    heading: string;
    subHeading: string;
    image: IImage;
    product: IProduct;
}

export interface FeatureProductsProps {
    id: number;
    __component: string;
    title: string;
    description: string;
    featureProduct: FeatureProduct[];
}
