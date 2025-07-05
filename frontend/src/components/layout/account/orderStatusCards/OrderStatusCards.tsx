import { FiPackage } from "react-icons/fi";
import { MdOutlineCancel } from "react-icons/md";
import { LuClock, LuTruck } from "react-icons/lu";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { OrderStatusCardsProps } from "./OrderStatusCards.interfaces";

const statusConfig = [
    {
        key: "Delivered",
        label: "Delivered",
        icon: (
            <IoMdCheckmarkCircleOutline className="text-3xl text-green-500" />
        ),
        textColor: "text-green-600",
    },
    {
        key: "Shipped",
        label: "Shipped",
        icon: <LuTruck className="text-3xl text-blue-500" />,
        textColor: "text-blue-600",
    },
    {
        key: "Processing",
        label: "Processing",
        icon: <LuClock className="text-3xl text-yellow-500" />,
        textColor: "text-yellow-600",
    },
    {
        key: "Cancelled",
        label: "Cancelled",
        icon: <MdOutlineCancel className="text-3xl text-red-500" />,
        textColor: "text-red-600",
    },
];

export default function OrderStatusCards({
    ordersData,
}: Readonly<OrderStatusCardsProps>) {
    const countByStatus = ordersData.reduce<Record<string, number>>(
        (acc, order) => {
            acc[order.deliveryStatus] = (acc[order.deliveryStatus] || 0) + 1;
            return acc;
        },
        {},
    );

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
            <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-600 font-medium">
                            Total Orders
                        </p>
                        <p className="text-2xl text-gray-900 font-bold">
                            {ordersData.length}
                        </p>
                    </div>
                    <FiPackage className="text-3xl text-blue-500" />
                </div>
            </div>
            {statusConfig.map(({ key, label, icon, textColor }) => (
                <div
                    key={key}
                    className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm"
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">
                                {label}
                            </p>
                            <p className={`text-2xl font-bold ${textColor}`}>
                                {countByStatus[key] || 0}
                            </p>
                        </div>
                        {icon}
                    </div>
                </div>
            ))}
        </div>
    );
}
