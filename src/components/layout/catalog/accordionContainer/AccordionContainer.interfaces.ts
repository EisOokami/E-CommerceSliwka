export interface IInitailAccordionItems {
    header: string;
    content: string[] | [];
    type: "checkbox" | "range" | "radio";
    searchBar?: boolean;
}
