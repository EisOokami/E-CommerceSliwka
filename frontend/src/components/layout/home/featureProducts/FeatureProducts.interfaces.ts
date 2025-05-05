import { IImage, Link } from "@/interfaces/interfaces";

export interface FeatureProduct {
    id: number;
    heading: string;
    subHeading: string;
    image: IImage;
    link: Link;
}

export interface FeatureProductsProps {
    id: number;
    __component: string;
    title: string;
    description: string;
    featureproduct: FeatureProduct[];
}
