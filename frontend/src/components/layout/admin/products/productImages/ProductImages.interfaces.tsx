import { ProductInput } from "@/interfaces/admin/api";
import { ProductImage } from "@/interfaces/admin/catalog";

export interface ProductImagesProps {
    data: ProductInput;
    availableImages: ProductImage[];
    initialImages?: ProductImage[];
    onChange: (value: ProductInput) => void;
}
