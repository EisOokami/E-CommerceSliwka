import { Image, Link, UtilityLink } from "@/interfaces/interfaces";

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
