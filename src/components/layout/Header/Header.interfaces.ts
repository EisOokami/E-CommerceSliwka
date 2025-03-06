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

export interface HeaderProps {
    data: {
        id: number;
        logoImage: Image;
        iconsLink: Link[];
        navigationLinks: Link[];
        logoLink: Link;
    };
    isUserSingIn: boolean;
}
