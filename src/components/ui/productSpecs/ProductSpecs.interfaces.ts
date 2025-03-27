export interface IProductSpecs {
    id: number;
    documentId: string;
    icon: string;
    name: string;
    specification: string;
}

export interface ProductSpecsProps {
    specsData: IProductSpecs[];
}
