import { EmblaOptionsType } from "embla-carousel";
import { IProduct } from "@/interfaces/interfaces";

export interface ProductsCarouselProps {
    productsData: IProduct[];
    options?: EmblaOptionsType;
}

export interface ProductsCarouselSlideProps {
    product: IProduct;
}
