import { IProduct } from "@/interfaces/interfaces";
import { create } from "zustand";

interface ICatalogStore {
    productsData: IProduct[];
    setProductsData: (newProductsData: IProduct[]) => void;
    totalPages: number;
    setTotalPages: (newTotalPages: number) => void;
    currentPage: number;
    setCurrentPage: (newCurrentPage: number) => void;
    productsCount: number;
    setProductsCount: (newProductsCount: number) => void;
    productRating: string;
    setProductRating: (newProductRating: string) => void;
    searchValue: string;
    setSearchValue: (newSearchValue: string) => void;
}

const useCatalogStore = create<ICatalogStore>((set) => ({
    productsData: [],
    setProductsData: (newProductsData) =>
        set(() => ({
            productsData: newProductsData,
        })),
    totalPages: 1,
    setTotalPages: (newTotalPages) =>
        set(() => ({
            totalPages: newTotalPages,
        })),
    currentPage: 1,
    setCurrentPage: (newCurrentPage) =>
        set(() => ({
            currentPage: newCurrentPage,
        })),
    productsCount: 0,
    setProductsCount: (newProductsCount) =>
        set(() => ({
            productsCount: newProductsCount,
        })),
    productRating: "all",
    setProductRating: (newProductRating) =>
        set(() => ({
            productRating: newProductRating,
        })),
    searchValue: "",
    setSearchValue: (newSearchValue) =>
        set(() => ({
            searchValue: newSearchValue,
        })),
}));

export default useCatalogStore;
