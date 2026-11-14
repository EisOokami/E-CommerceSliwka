import { getCoupons } from "@/data/admin/loaders/catalogLoaders";
import { loadList } from "@/data/admin/loadList";
import { SearchParams } from "@/types/types";

import Coupons from "@/components/layout/admin/catalog/coupons/Coupons";
import renderAdminPage from "@/data/admin/page";

export default async function Page({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    return renderAdminPage(async () => (
        <Coupons
            initialData={await loadList(searchParams, "coupons", getCoupons)}
        />
    ));
}
