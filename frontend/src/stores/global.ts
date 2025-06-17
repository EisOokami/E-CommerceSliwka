import { create } from "zustand";

interface IGlobalStore {
    productsInCartCount: number;
    setProductsInCartCount: (newProductsInCartCount: number) => void;
    productsInWishlistCount: number;
    setProductsInWishlistCount: (newProductsInWishlistCount: number) => void;
}

const useGlobalStore = create<IGlobalStore>((set) => ({
    productsInCartCount: 0,
    setProductsInCartCount: (newProductsInCartCount) =>
        set(() => ({
            productsInCartCount: newProductsInCartCount,
        })),
    productsInWishlistCount: 0,
    setProductsInWishlistCount: (newProductsInWishlistCount) =>
        set(() => ({
            productsInWishlistCount: newProductsInWishlistCount,
        })),
}));

export default useGlobalStore;
