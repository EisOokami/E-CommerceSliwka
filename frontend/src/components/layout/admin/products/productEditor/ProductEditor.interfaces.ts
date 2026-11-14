import { ProductImage } from "@/interfaces/admin/catalog";
import { ProductInput } from "@/interfaces/admin/api";

export interface ProductEditorProps {
    id?: string;
    initialData:
        | (ProductInput & {
              image?: ProductImage;
              sliderImages?: ProductImage[];
          })
        | null;
    categoryOptions: { name: string }[];
    images: ProductImage[];
}
