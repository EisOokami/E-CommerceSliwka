import { IProduct } from "@/interfaces/interfaces";

export interface SearchItemProps {
    productData: IProduct;
    handleCloseResult: () => void;
    handleCloseMenu: () => void;
}
