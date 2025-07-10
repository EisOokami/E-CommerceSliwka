import { getOrdersData } from "@/data/loaders";
import { LuClock } from "react-icons/lu";
import { FiPackage } from "react-icons/fi";
import { IOrder } from "@/interfaces/interfaces";

import OrderCard from "@/components/ui/orderCard/OrderCard";
import OrderStatusCards from "@/components/layout/account/orderStatusCards/OrderStatusCards";

export default async function OrderHistoryPage() {
    const ordersData: IOrder[] = await getOrdersData();

    return (
        <main className="grid gap-10 w-full">
            <div className="flex items-center gap-1">
                <LuClock className="md:mt-1 text-3xl" />
                <h1 className="text-2xl md:text-3xl xl:text-4xl font-medium">
                    Order History
                </h1>
            </div>
            <OrderStatusCards ordersData={ordersData} />
            <div className="space-y-4">
                {!ordersData.length ? (
                    <div className="grid place-items-center gap-2 w-full">
                        <FiPackage className="text-8xl text-gray-300" />
                        <h1 className="text-center text-3xl text-gray-800 font-medium">
                            No orders found
                        </h1>
                    </div>
                ) : (
                    ordersData.map((orderData) => (
                        <OrderCard
                            key={orderData.documentId}
                            orderData={orderData}
                        />
                    ))
                )}
            </div>
        </main>
    );
}
