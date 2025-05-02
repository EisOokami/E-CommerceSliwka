import { Dispatch, SetStateAction } from "react";
import { ICart } from "@/interfaces/interfaces";

export interface CartItemProps {
    cartItem: ICart;
    setDeletedProducts: Dispatch<SetStateAction<string[]>>;
}
