export interface Link {
    id: number;
    url: string;
    text: string;
    isExternal: boolean;
}

export interface NavigationProps {
    navigationLinks: Link[];
}
