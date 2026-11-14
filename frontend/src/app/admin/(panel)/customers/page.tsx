import { getCustomers } from "@/data/admin/loaders";
import { loadList } from "@/data/admin/loadList";
import { SearchParams } from "@/types/types";

import Customers from "@/components/layout/admin/customers/Customers";
import renderAdminPage from "@/data/admin/page";

export default async function Page({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    return renderAdminPage(async () => (
        <Customers
            initialData={await loadList(
                searchParams,
                "customers",
                getCustomers,
            )}
        />
    ));
}
