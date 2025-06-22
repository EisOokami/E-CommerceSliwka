import { IImage, ILink } from "@/interfaces/interfaces";

export interface HeaderProps {
    data: {
        id: number;
        logoImage: IImage;
        iconsLink: ILink[];
        navigationLinks: ILink[];
        logoLink: ILink;
    };
    isUserSingIn: boolean;
    cartsCount: number;
    wishlistsCount: number;
}
