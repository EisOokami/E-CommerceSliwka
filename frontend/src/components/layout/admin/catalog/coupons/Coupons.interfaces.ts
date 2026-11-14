import { Collection } from "@/interfaces/admin/api";
import { Coupon } from "@/interfaces/admin/catalog";

export interface CouponsProps {
    initialData: Collection<Coupon>;
}
