import { IStore } from "@/interfaces/interfaces";

export interface CarouselClientProps {
    productsData: IStore[];
    options: unknown;
    width: number | `${number}` | undefined;
    height: number | `${number}` | undefined;
}
