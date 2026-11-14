import { getProducts } from "@/data/admin/loaders";
import { loadList } from "@/data/admin/loadList";
import { SearchParams } from "@/types/types";

import Products from "@/components/layout/admin/products/Products";
import renderAdminPage from "@/data/admin/page";

export default async function Page({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    return renderAdminPage(async () => (
        <Products
            initialData={await loadList(searchParams, "products", getProducts)}
        />
    ));
}
