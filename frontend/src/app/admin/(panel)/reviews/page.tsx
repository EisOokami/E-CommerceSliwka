import { getManagedReviews } from "@/data/admin/loaders/catalogLoaders";
import { loadList } from "@/data/admin/loadList";
import { SearchParams } from "@/types/types";

import Reviews from "@/components/layout/admin/catalog/reviews/Reviews";
import renderAdminPage from "@/data/admin/page";

export default async function Page({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    return renderAdminPage(async () => (
        <Reviews
            initialData={await loadList(
                searchParams,
                "reviews",
                getManagedReviews,
            )}
        />
    ));
}
