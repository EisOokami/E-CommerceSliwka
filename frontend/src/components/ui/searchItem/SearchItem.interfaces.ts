import { IProduct } from "@/interfaces/interfaces";

export interface SearchItemProps {
    productData: Omit<
        IProduct,
        | "wishlist"
        | "productOptions"
        | "sliderImages"
        | "colors"
        | "options"
        | "productInfo"
        | "productSpecs"
        | "detailedSpecifications"
    >;
    handleCloseResult: () => void;
    handleCloseMenu: () => void;
}
