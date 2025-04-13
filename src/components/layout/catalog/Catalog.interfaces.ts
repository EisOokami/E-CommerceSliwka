import { Dispatch, SetStateAction } from "react";

export interface CatalogProps {
    limit: number;
    totalPages: number;
    setTotalPages: Dispatch<SetStateAction<number>>;
    currentPage: number;
    productsCount: number;
    setProductsCount: Dispatch<SetStateAction<number>>;
}
