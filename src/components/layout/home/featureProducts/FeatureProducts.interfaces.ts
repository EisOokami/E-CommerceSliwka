export interface Image {
    id: number;
    documentId: string;
    url: string;
    alternativeText: string | null;
}

export interface Link {
    id: number;
    url: string;
    text: string;
    isExternal: boolean;
}

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
