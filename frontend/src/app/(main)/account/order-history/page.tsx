import { redirect } from "next/navigation";
import { getAllOrdersData } from "@/data/main/loaders";
import { getUserMeLoader } from "@/data/main/services/getUserMeLoader";
import { LuClock } from "react-icons/lu";

import OrderStatusCards from "@/components/layout/main/account/orderStatusCards/OrderStatusCards";
import OrderList from "@/components/layout/main/account/orderList/OrderList";

export default async function OrderHistoryPage() {
    const user = await getUserMeLoader();
    const ordersData = await getAllOrdersData();

    if (!user.ok) {
        redirect("/signIn");
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
