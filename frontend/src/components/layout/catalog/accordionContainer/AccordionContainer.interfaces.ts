import { Dispatch, SetStateAction } from "react";
import { IProduct } from "@/interfaces/interfaces";

export interface IAccordionItems {
    header: string;
    content: string[] | number[] | [];
    type: "checkbox" | "range" | "radio";
    setState:
        | Dispatch<SetStateAction<{ [key: string]: string[] }>>
        | Dispatch<SetStateAction<{ [key: string]: number[] }>>;
    defaultChecked?: string;
    rangeText?: [string, string];
}

export interface IFilterParams {
    search: string | null;
    category: string | null;
    price: number[] | null;
    colors: string[] | null;
    options: string[] | null;
    rating: number | null;
}

export interface AccordionContainerProps {
    setFilteredProducts: Dispatch<SetStateAction<IProduct[]>>;
}
