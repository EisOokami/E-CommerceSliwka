import { getOrder } from "@/data/admin/loaders";

import OrderDetail from "@/components/layout/admin/orders/orderDetail/OrderDetail";
import renderAdminPage from "@/data/admin/page";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    return renderAdminPage(async () => {
        const { id } = await params;

        return <OrderDetail id={id} initialData={await getOrder(id)} />;
    });
}
