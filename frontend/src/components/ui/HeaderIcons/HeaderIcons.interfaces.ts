import { ILink } from "@/interfaces/interfaces";

export interface HeaderIconsProps {
    iconsLink: ILink[];
    isUserSingIn: boolean;
    handleCloseMenu: () => void;
    globalProductsInCartCount: number;
    globalProductsInWishlistCount: number;
}
