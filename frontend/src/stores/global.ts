import { create } from "zustand";

interface IGlobalStore {
    productsInCartCount: number | null;
    setProductsInCartCount: (newProductsInCartCount: number) => void;
    productsInWishlistCount: number | null;
    setProductsInWishlistCount: (newProductsInWishlistCount: number) => void;
}

const useGlobalStore = create<IGlobalStore>((set) => ({
    productsInCartCount: null,
    setProductsInCartCount: (newProductsInCartCount) =>
        set(() => ({
            productsInCartCount: newProductsInCartCount,
        })),
    productsInWishlistCount: null,
    setProductsInWishlistCount: (newProductsInWishlistCount) =>
        set(() => ({
            productsInWishlistCount: newProductsInWishlistCount,
        })),
}));

export default useGlobalStore;
