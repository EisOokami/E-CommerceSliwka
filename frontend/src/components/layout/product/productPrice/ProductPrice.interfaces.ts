import { IColors, IOptions } from "@/interfaces/interfaces";

export interface ProductPriceProps {
    price: number;
    isDiscount: boolean;
    discount?: number | null;
    colorsData: IColors[] | null;
    optionsData: IOptions[] | null;
}
