import { getCategories } from "@/data/admin/loaders/catalogLoaders";
import { loadList } from "@/data/admin/loadList";
import { SearchParams } from "@/types/types";

import Categories from "@/components/layout/admin/catalog/categories/Categories";
import renderAdminPage from "@/data/admin/page";

export default async function Page({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    return renderAdminPage(async () => (
        <Categories
            initialData={await loadList(
                searchParams,
                "categories",
                getCategories,
            )}
        />
    ));
}
