import { getCustomer } from "@/data/admin/loaders";

import CustomerDetail from "@/components/layout/admin/customers/customerDetail/CustomerDetail";
import renderAdminPage from "@/data/admin/page";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    return renderAdminPage(async () => {
        const { id } = await params;

        return <CustomerDetail id={id} initialData={await getCustomer(id)} />;
    });
}
