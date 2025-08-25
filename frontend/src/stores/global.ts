import { create } from "zustand";

interface IGlobalStore {
    productsInCartCount: number | null;
    setProductsInCartCount: (newProductsInCartCount: number) => void;
    productsInWishlistCount: number | null;
    setProductsInWishlistCount: (newProductsInWishlistCount: number) => void;
    isRefreshedPage: boolean;
    setIsRefreshedPage: (newIsRefreshedPage: boolean) => void;
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
    isRefreshedPage: false,
    setIsRefreshedPage: (newIsRefreshedPage) =>
        set(() => ({
            isRefreshedPage: newIsRefreshedPage,
        })),
}));

export default useGlobalStore;
