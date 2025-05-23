import { IProduct } from "@/interfaces/interfaces";
import { Dispatch, SetStateAction } from "react";

export interface SearchItemProps {
    productData: IProduct;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    setIsOpenMenu: Dispatch<SetStateAction<boolean>>;
}
