import { Dispatch, SetStateAction } from "react";
import { IProduct } from "@/interfaces/interfaces";

export interface ProductsProps {
    productsData: IProduct[];
    setProductRating: Dispatch<SetStateAction<string>>;
    productsCount: number;
}
