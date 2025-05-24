import { IImage, ILink, IUtilityLink } from "@/interfaces/interfaces";

export interface FooterProps {
    data: {
        id: number;
        aboutUs: string;
        logoImage: IImage;
        logoLink: ILink;
        utilityLinks: IUtilityLink[];
        socialLinks: ILink[];
    };
}
