import { Dispatch, SetStateAction } from "react";
import { IWishlist } from "@/interfaces/interfaces";

export interface WishlistItemProps {
    wishlist: IWishlist;
    setRemovedProducts: Dispatch<SetStateAction<string[]>>;
}
