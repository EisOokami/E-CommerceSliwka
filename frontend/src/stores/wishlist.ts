import { IWishlist } from "@/interfaces/interfaces";
import { create } from "zustand";

interface IWishlistStore {
    wishlist: IWishlist[];
    setWishlist: (newWishlist: IWishlist[]) => void;
    productsInWishlist: string[];
    setProductsInWishlist: (newProductsInWishlist: string[]) => void;
    removedProducts: string[];
    setRemovedProducts: (newRemovedProducts: string[]) => void;
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
    removedProducts: [],
    setRemovedProducts: (newRemovedProducts) =>
        set(() => ({
            removedProducts: newRemovedProducts,
        })),
}));

export default useWishlistStore;
