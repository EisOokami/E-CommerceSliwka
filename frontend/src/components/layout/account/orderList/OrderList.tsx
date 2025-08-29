"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import useOrderStore from "@/stores/order";
import { getOrdersData } from "@/data/loaders";
import { FiPackage } from "react-icons/fi";
import { IOrder } from "@/interfaces/interfaces";

import OrderCardSkeleton from "@/components/ui/orderCard/OrderCardSkeleton";
import Pagination from "@/components/ui/pagination/Pagination";
const OrderCard = dynamic(() => import("@/components/ui/orderCard/OrderCard"), {
    ssr: false,
    loading: () => <OrderCardSkeleton />,
});

const limit = 8;

export default function OrderList() {
    const selectedDeliveryStatus = useOrderStore(
        (state) => state.selectedDeliveryStatus,
    );
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [ordersData, setOrdersData] = useState<IOrder[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const pathname = usePathname();

    useEffect(() => {
        if (pathname === "/account/order-history") {
            setCurrentPage(1);
        }
    }, [pathname]);

    useEffect(() => {
        (async () => {
            if (selectedDeliveryStatus === "All") {
                const updatedOrdersData = await getOrdersData(
                    currentPage,
                    limit,
                );

                if (updatedOrdersData) {
                    setOrdersData(updatedOrdersData.data);
                    setTotalPages(updatedOrdersData.totalPages);
                    setIsLoading(false);
                }
            }

            if (selectedDeliveryStatus !== "All") {
                const updatedOrdersData = await getOrdersData(
                    currentPage,
                    limit,
                    selectedDeliveryStatus,
                );

                if (updatedOrdersData) {
                    setOrdersData(updatedOrdersData.data);
                    setTotalPages(updatedOrdersData.totalPages);
                    setIsLoading(false);
                }
            }
        })();
    }, [currentPage, selectedDeliveryStatus, setTotalPages]);

    return (
        <div className="grid gap-3">
            <div className="space-y-4">
                {isLoading ? (
                    [...Array(8)].map((_, i) => <OrderCardSkeleton key={i} />)
                ) : !ordersData.length ? (
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
            <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
            />
        </div>
    );
}
