import { Image, Link } from "@/interfaces/interfaces";

export interface FeatureProduct {
    id: number;
    heading: string;
    subHeading: string;
    image: Image;
    link: Link;
}

export interface FeatureProductsProps {
    id: number;
    __component: string;
    title: string;
    description: string;
    featureproduct: FeatureProduct[];
}
