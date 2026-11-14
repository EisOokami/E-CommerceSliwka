import { Collection } from "@/interfaces/admin/api";
import { Category } from "@/interfaces/admin/catalog";

export interface CategoriesProps {
    initialData: Collection<Category>;
}
