import { create } from "zustand";

interface ICartStore {
    deletedProducts: string[];
    setDeletedProducts: (newDeletedProducts: string[]) => void;
    productsQuantity: { [key: string]: number };
    setProductsQuantity: (newProductsQuantity: {
        [key: string]: number;
    }) => void;
}

const useCartStore = create<ICartStore>((set) => ({
    deletedProducts: [],
    setDeletedProducts: (newDeletedProducts) =>
        set(() => ({
            deletedProducts: newDeletedProducts,
        })),
    productsQuantity: {},
    setProductsQuantity: (newProductsQuantity) =>
        set((state) => ({
            productsQuantity: {
                ...state.productsQuantity,
                ...newProductsQuantity,
            },
        })),
}));

export default useCartStore;
