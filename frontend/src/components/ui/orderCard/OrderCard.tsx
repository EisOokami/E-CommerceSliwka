"use client";

import { useState } from "react";
import { FiPackage } from "react-icons/fi";
import { MdOutlineCancel } from "react-icons/md";
import { LuClock, LuTruck, LuCalendar } from "react-icons/lu";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { OrderCardProps } from "./OrderCard.interfaces";

import StrapiImage from "../strapiImage/StrapiImage";

export default function OrderCard({ orderData }: Readonly<OrderCardProps>) {
    const [isExpanded, setIsExpanded] = useState(false);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "delivered":
                return (
                    <IoMdCheckmarkCircleOutline className="text-xl text-green-500" />
                );
            case "shipped":
                return <LuTruck className="text-xl text-blue-500" />;
            case "processing":
                return <LuClock className="text-xl text-yellow-300" />;
            case "cancelled":
                return <MdOutlineCancel className="text-xl text-red-500" />;
            default:
                return <FiPackage className="text-xl text-gray-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "delivered":
                return "bg-green-100 text-green-800 border-green-200";
            case "shipped":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "processing":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "cancelled":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    };

    const total = orderData.cartItems.reduce((accumulator, currentValue) => {
        const price =
            currentValue.product.isDiscount &&
            currentValue.product.discountedPrice
                ? currentValue.product.discountedPrice
                : currentValue.product.price;

        return accumulator + price;
    }, 0);

    return (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md overflow-hidden transition-shadow">
            <div className="p-6">
                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div>
                            <h3 className="text-lg text-gray-900 font-semibold">
                                Order #{orderData.orderId}
                            </h3>
                            {orderData.createdAt && (
                                <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                                    <LuCalendar className="text-base" />
                                    <span>
                                        {formatDate(orderData.createdAt)}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div
                            className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-medium border rounded-full 
                                ${getStatusColor(
                                    orderData.deliveryStatus.toLowerCase(),
                                )}
                                `}
                        >
                            {getStatusIcon(
                                orderData.deliveryStatus.toLowerCase(),
                            )}
                            <span className="capitalize">
                                {orderData.deliveryStatus}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm text-gray-600">Total</p>
                            <p className="text-xl text-gray-900 font-bold">
                                ${total}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                        <FiPackage className="text-base" />
                        <span>
                            {orderData.cartItems.length} item
                            {orderData.cartItems.length > 1 ? "s" : ""}
                        </span>
                    </div>
                    {orderData.trackingNumber && (
                        <div>
                            <span className="font-medium">Tracking:</span>{" "}
                            {orderData.trackingNumber}
                        </div>
                    )}
                    {orderData.estimatedDelivery && (
                        <div>
                            <span className="font-medium">Est. delivery:</span>{" "}
                            {formatDate(orderData.estimatedDelivery)}
                        </div>
                    )}
                </div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-700 transition-colors"
                >
                    {isExpanded ? (
                        <>
                            <IoChevronUp className="text-base" />
                            Hide details
                        </>
                    ) : (
                        <>
                            <IoChevronDown className="text-base" />
                            Show details
                        </>
                    )}
                </button>
            </div>
            {isExpanded && (
                <div className="p-6 bg-gray-50 border-t border-gray-100">
                    <h4 className="mb-4 text-gray-900 font-semibold">
                        Order Items
                    </h4>
                    <div className="space-y-3">
                        {orderData.cartItems.map((cartItem) => (
                            <div
                                key={cartItem.documentId}
                                className="flex justify-between items-center p-4 bg-white rounded-lg"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex justify-center items-center w-12 h-12 rounded-lg">
                                        <StrapiImage
                                            src={cartItem.product.image.url}
                                            alt={
                                                cartItem.product.image
                                                    .alternativeText ??
                                                cartItem.product.name
                                            }
                                            width={50}
                                            height={50}
                                        />
                                    </div>
                                    <div>
                                        <h5 className="text-gray-900 font-medium">
                                            {cartItem.product.name}
                                        </h5>
                                        <p className="text-sm text-gray-600">
                                            Qty: {cartItem.quantity}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-900 font-semibold">
                                        $
                                        {cartItem.product.isDiscount &&
                                        cartItem.product.discountedPrice
                                            ? cartItem.product.discountedPrice
                                            : cartItem.product.price}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        $
                                        {(cartItem.product.isDiscount &&
                                        cartItem.product.discountedPrice
                                            ? cartItem.product.discountedPrice
                                            : cartItem.product.price *
                                              cartItem.quantity
                                        ).toFixed(2)}{" "}
                                        total
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
