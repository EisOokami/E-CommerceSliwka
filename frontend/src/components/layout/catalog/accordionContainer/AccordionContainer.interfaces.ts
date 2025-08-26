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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any | null;
}

export interface AccordionContainerProps {
    setFilteredProducts: Dispatch<SetStateAction<IProduct[]>>;
}
