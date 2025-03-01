export interface Link {
    id: number;
    url: string;
    text: string;
    isExternal: boolean;
}

export interface SocialMediaProps {
    socialLinks: Link[];
    styles: { [key: string]: string };
}
