import { IImage, Link } from "@/interfaces/interfaces";

export interface HeaderProps {
    data: {
        id: number;
        logoImage: IImage;
        iconsLink: Link[];
        navigationLinks: Link[];
        logoLink: Link;
    };
    isUserSingIn: boolean;
}
