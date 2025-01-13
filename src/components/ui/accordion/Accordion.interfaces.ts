export interface AccordionItemProps {
    header: string;
    children: React.ReactNode;
}

export interface AccordionContainerProps {
    items: {
        header: string;
        content: string[] | [];
        type: "checkbox" | "range" | "radio";
        searchBar?: boolean;
    }[];
}
