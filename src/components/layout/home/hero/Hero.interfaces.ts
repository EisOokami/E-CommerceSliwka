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

export interface HeroProps {
    id: number;
    documentId: string;
    __component: string;
    heading: string;
    subHeading: string;
    image: Image;
    link: Link;
}
