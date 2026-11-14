import { Dispatch, SetStateAction } from "react";
import { ICategory } from "@/interfaces/interfaces";

export interface CategoriesCarouselProps {
    categoriesData: ICategory[];
    activeCategory: string;
    setActiveCategory: Dispatch<SetStateAction<string>>;
}
