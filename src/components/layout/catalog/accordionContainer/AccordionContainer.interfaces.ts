import { Dispatch, SetStateAction } from "react";
import { IStore } from "@/interfaces/interfaces";

export interface IAccordionItems {
    header: string;
    content: string[] | number[] | [];
    type: "checkbox" | "range" | "radio";
    searchBar?: boolean;
    setState:
        | Dispatch<SetStateAction<{ [key: string]: string[] }>>
        | Dispatch<SetStateAction<{ [key: string]: number[] }>>;
    defaultChecked?: string;
    rangeText?: [string, string];
}

export interface IFilterParams {
    category: string | null;
    price: number[] | null;
    colors: string[] | null;
    options: string[] | null;
    rating: number | null;
}

export interface AccordionContainerProps {
    setFilteredProducts: Dispatch<SetStateAction<IStore[]>>;
    productRating: string;
    limit: number;
    currentPage: number;
    totalPages: number;
    setTotalPages: Dispatch<SetStateAction<number>>;
    productsCount: number;
    setProductsCount: Dispatch<SetStateAction<number>>;
}
