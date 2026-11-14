import { Collection } from "@/interfaces/admin/api";
import { ManagedReview } from "@/interfaces/admin/catalog";

export interface ReviewsProps {
    initialData: Collection<ManagedReview>;
}
