import { IArray, ICategory, IProduct } from "@/interfaces/interfaces";

export interface ProductsProps {
    id: number;
    __component: string;
    categories: ICategory[];
    tabs: IArray[];
    newArrival: IProduct[];
    bestseller: IProduct[];
    featuredProducts: IProduct[];
}
