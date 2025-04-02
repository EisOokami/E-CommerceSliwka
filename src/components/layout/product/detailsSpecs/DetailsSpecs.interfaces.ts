export interface ISpecification {
    id: number;
    item: string;
}
export interface ISpecifications {
    id: number;
    name: string;
    specifications: ISpecification[];
}

export interface IDetailedSpecifications {
    id: number;
    name: string;
    specifications: ISpecifications[];
}

export interface DetailsSpecsProps {
    specsData: IDetailedSpecifications[];
}
