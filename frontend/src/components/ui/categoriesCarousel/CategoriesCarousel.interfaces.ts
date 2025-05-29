import { Dispatch, SetStateAction } from "react";
import { ICategory, IProduct } from "@/interfaces/interfaces";

export interface CategoriesCarouselProps {
    categoriesData: ICategory[];
    activeCategory: string;
    setActiveCategory: Dispatch<SetStateAction<string>>;
    setProductsData: Dispatch<SetStateAction<IProduct[]>>;
    tabsData: IProduct[][];
    activeTab: number;
}
