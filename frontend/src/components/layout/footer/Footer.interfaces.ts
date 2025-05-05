import { IImage, Link, UtilityLink } from "@/interfaces/interfaces";

export interface FooterProps {
    data: {
        id: number;
        aboutUs: string;
        logoImage: IImage;
        logoLink: Link;
        utilityLinks: UtilityLink[];
        socialLinks: Link[];
    };
}
