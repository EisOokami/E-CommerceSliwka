import { IImage } from "@/interfaces/interfaces";
import { EmblaOptionsType } from "embla-carousel";

export interface ProductCarouselProps {
    images: IImage[];
    options?: EmblaOptionsType;
}

export interface ProductCarouselThumbsProps {
    selected: boolean;
    image: IImage;
    onClick: () => void;
}
