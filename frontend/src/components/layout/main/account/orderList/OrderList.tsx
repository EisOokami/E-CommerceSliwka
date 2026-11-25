"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import useOrderStore from "@/stores/order";
import { getOrdersData } from "@/data/main/loaders";
import { FiPackage } from "react-icons/fi";
import { IOrder } from "@/interfaces/interfaces";

import OrderCardSkeleton from "@/components/ui/main/orderCard/OrderCardSkeleton";
import Pagination from "@/components/ui/main/pagination/Pagination";

const OrderCard = dynamic(
    () => import("@/components/ui/main/orderCard/OrderCard"),
    {
        ssr: false,
        loading: () => <OrderCardSkeleton />,
    },
);

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
    const [error, setError] = useState("");

    useEffect(() => {
        if (pathname === "/account/order-history") {
            setCurrentPage(1);
        }
    }, [pathname]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedDeliveryStatus]);

    useEffect(() => {
        let active = true;

        setIsLoading(true);
        setError("");

        getOrdersData(currentPage, limit, selectedDeliveryStatus)
            .then((result) => {
                if (!active) {
                    return;
                }
                if (!result) {
                    throw new Error("Please sign in.");
                }

                setOrdersData(result.data);
                setTotalPages(result.totalPages);
            })
            .catch(() => {
                if (active) {
                    setError("Orders could not be loaded. Please reload.");
                }
            })
            .finally(() => {
                if (active) {
                    setIsLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, [currentPage, selectedDeliveryStatus]);

    return (
        <div className="grid gap-3">
            <div className="space-y-4">
                {error ? (
                    <p>{error}</p>
                ) : isLoading ? (
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
                        <OrderCard key={orderData.id} orderData={orderData} />
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
