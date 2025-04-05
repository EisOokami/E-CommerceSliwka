import { Image, Link } from "@/interfaces/interfaces";

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
