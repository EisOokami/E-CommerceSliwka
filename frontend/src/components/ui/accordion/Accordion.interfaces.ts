import { Dispatch, ReactNode, SetStateAction } from "react";

export interface AccordionItemProps {
    header: string;
    children: ReactNode;
}

export interface AccordionContainerProps {
    items: {
        header: string;
        content: string[] | number[] | [];
        type: "checkbox" | "range" | "radio";
        setState:
            | Dispatch<SetStateAction<{ [key: string]: string[] }>>
            | Dispatch<SetStateAction<{ [key: string]: number[] }>>;
        defaultChecked?: string;
        rangeText?: [string, string];
    }[];
}
