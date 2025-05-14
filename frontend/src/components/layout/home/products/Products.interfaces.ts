import { IProduct } from "@/interfaces/interfaces";

export interface ICategories {
    id: number;
    category: string;
}

export interface ITabs {
    id: number;
    item: string;
}

export interface ProductsProps {
    id: number;
    __component: string;
    categories: ICategories[];
    tabs: ITabs[];
    newArrival: IProduct[];
    bestseller: IProduct[];
    featuredProducts: IProduct[];
}
