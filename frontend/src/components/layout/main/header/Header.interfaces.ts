import { IHeader } from "@/interfaces/globalData";

export interface HeaderProps {
    data: IHeader;
    isUserSingIn: boolean;
    globalProductsInCartCount: number;
    globalProductsInWishlistCount: number;
}
