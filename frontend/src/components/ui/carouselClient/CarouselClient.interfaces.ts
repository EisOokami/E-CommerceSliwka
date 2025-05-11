import { IProduct } from "@/interfaces/interfaces";

export interface CarouselClientProps {
    productsData: IProduct[];
    options: unknown;
    width: number | `${number}` | undefined;
    height: number | `${number}` | undefined;
}
