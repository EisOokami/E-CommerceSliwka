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

export interface UtilityLinksProps {
    utilityLinks: UtilityLink[];
    styles: { [key: string]: string };
}
