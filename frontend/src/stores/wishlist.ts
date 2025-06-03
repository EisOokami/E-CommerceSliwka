import { IWishlist } from "@/interfaces/interfaces";
import { create } from "zustand";

interface IWishlistStore {
    wishlist: IWishlist[];
    setWishlist: (newWishlist: IWishlist[]) => void;
    productsInWishlist: string[];
    setProductsInWishlist: (newProductsInWishlist: string[]) => void;
}

const useWishlistStore = create<IWishlistStore>((set) => ({
    wishlist: [],
    setWishlist: (newWishlist) =>
        set(() => ({
            wishlist: newWishlist,
        })),
    productsInWishlist: [],
    setProductsInWishlist: (newProductsInWishlist) =>
        set(() => ({
            productsInWishlist: newProductsInWishlist,
        })),
}));

export default useWishlistStore;
