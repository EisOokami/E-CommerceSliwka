import { BaseSchema, IImage, ILink, IUtilityLink } from "./interfaces";

export interface IHeader extends Pick<BaseSchema, "id"> {
    logoImage: IImage;
    iconsLink: ILink[];
    navigationLinks: ILink[];
    logoLink: ILink;
}

export interface IFooter extends Pick<BaseSchema, "id"> {
    aboutUs: string;
    logoImage: IImage;
    logoLink: ILink;
    utilityLinks: IUtilityLink[];
    socialLinks: ILink[];
}

export interface IGlobalData extends BaseSchema {
    title: string;
    description: string;
    header: IHeader;
    footer: IFooter;
}
