import { JSX } from "react";
import { DeliveryStatus } from "@/types/types";
import { IOrder } from "@/interfaces/interfaces";

export interface OrderStatusCardsProps {
    ordersData: IOrder[];
}

export interface IStatusConfig {
    key: DeliveryStatus;
    label: DeliveryStatus;
    icon: JSX.Element;
    textColor: string;
}
