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

export interface UtilityLink {
    id: number;
    title: string;
    links: Link[];
}

export interface FooterProps {
    data: {
        id: number;
        aboutUs: string;
        logoImage: Image;
        logoLink: Link;
        utilityLinks: UtilityLink[];
        socialLinks: Link[];
    };
}
