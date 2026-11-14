import { getOrders } from "@/data/admin/loaders";
import { loadList } from "@/data/admin/loadList";
import { SearchParams } from "@/types/types";

import Orders from "@/components/layout/admin/orders/Orders";
import renderAdminPage from "@/data/admin/page";

export default async function Page({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    return renderAdminPage(async () => (
        <Orders
            initialData={await loadList(searchParams, "orders", getOrders)}
        />
    ));
}
