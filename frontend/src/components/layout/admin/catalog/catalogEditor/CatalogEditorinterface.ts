import { Category, Coupon } from "@/interfaces/admin/catalog";

export interface CatalogEditorProps {
    resource: "categories" | "coupons";
    id?: string;
    initialData: Category | Coupon | null;
}
