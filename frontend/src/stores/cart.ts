import { create } from "zustand";

interface ICartStore {
    deletedProducts: string[];
    setDeletedProducts: (newDeletedProducts: string[]) => void;
}

const useCartStore = create<ICartStore>((set) => ({
    deletedProducts: [],
    setDeletedProducts: (newDeletedProducts) =>
        set(() => ({
            deletedProducts: newDeletedProducts,
        })),
}));

export default useCartStore;
