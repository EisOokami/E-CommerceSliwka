import { ILink } from "@/interfaces/interfaces";

export interface HeaderIconsProps {
    iconsLink: ILink[];
    isUserSingIn: boolean;
    handleCloseMenu: () => void;
    cartsCount: number;
    wishlistsCount: number;
}
