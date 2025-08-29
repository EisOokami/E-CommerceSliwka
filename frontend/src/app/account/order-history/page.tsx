import { getOrdersData } from "@/data/loaders";
import { LuClock } from "react-icons/lu";
import { IOrder } from "@/interfaces/interfaces";

import OrderStatusCards from "@/components/layout/account/orderStatusCards/OrderStatusCards";
import OrderList from "@/components/layout/account/orderList/OrderList";

export default async function OrderHistoryPage() {
    const ordersData = (await getOrdersData(1, 999999)) as {
        data: IOrder[];
        totalPages: number;
    };

    return (
        <main className="grid gap-10 w-full">
            <div className="flex items-center gap-1">
                <LuClock className="md:mt-1 text-3xl" />
                <h1 className="text-2xl md:text-3xl xl:text-4xl font-medium">
                    Order History
                </h1>
            </div>
            <OrderStatusCards ordersData={ordersData.data} />
            <OrderList />
        </main>
    );
}
