import { IImage } from "@/interfaces/interfaces";

export interface ProductCarouselProps {
    images: IImage[];
}

export interface ProductCarouselThumbsProps {
    selected: boolean;
    image: IImage;
    onClick: () => void;
}
