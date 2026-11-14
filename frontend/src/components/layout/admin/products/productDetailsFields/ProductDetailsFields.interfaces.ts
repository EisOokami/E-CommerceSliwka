import { ProductInput } from "@/interfaces/admin/api";

export interface ProductDetailsFieldsProps {
    data: ProductInput;
    onChange: (value: ProductInput) => void;
}
