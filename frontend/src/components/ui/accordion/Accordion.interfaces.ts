import { Dispatch, SetStateAction } from "react";

export interface AccordionItemProps {
    header: string;
    children: React.ReactNode;
}

export interface AccordionContainerProps {
    items: {
        header: string;
        content: string[] | number[] | [];
        type: "checkbox" | "range" | "radio";
        searchBar?: boolean;
        setState:
            | Dispatch<SetStateAction<{ [key: string]: string[] }>>
            | Dispatch<SetStateAction<{ [key: string]: number[] }>>;
        defaultChecked?: string;
        rangeText?: [string, string];
    }[];
}
