import { redirect } from "next/navigation";
import { getOrdersData } from "@/data/loaders";
import { getUserMeLoader } from "@/data/services/getUserMeLoader";
import { LuClock } from "react-icons/lu";

import OrderStatusCards from "@/components/layout/account/orderStatusCards/OrderStatusCards";
import OrderList from "@/components/layout/account/orderList/OrderList";

export default async function OrderHistoryPage() {
    const user = await getUserMeLoader();
    const ordersData = await getOrdersData(1, 999999);

    if (!user.ok) {
        redirect("/singIn");
    }

    return (
        <main className="grid gap-10 w-full">
            <div className="flex items-center gap-1">
                <LuClock className="md:mt-1 text-3xl" />
                <h1 className="text-2xl md:text-3xl xl:text-4xl font-medium">
                    Order History
                </h1>
            </div>
            {ordersData && ordersData.data.length ? (
                <OrderStatusCards ordersData={ordersData.data} />
            ) : null}
            <OrderList />
        </main>
    );
}
