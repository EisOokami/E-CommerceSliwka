import { Dispatch, SetStateAction } from "react";
import { IStore } from "@/interfaces/interfaces";

export interface ProductsProps {
    productsData: IStore[];
    setProductRating: Dispatch<SetStateAction<string>>;
    productsCount: number;
}
