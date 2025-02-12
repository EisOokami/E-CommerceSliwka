export interface ISpecs {
    name: string;
    value: string | string[];
}

export interface DetailsSpecsProps {
    specsData: { title: string; specs: ISpecs[] }[];
}
