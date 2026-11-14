import { orders } from "../db/schema.js";
import { defineQuery } from "../utils/query/defineQuery.js";

export const ordersQuery = defineQuery({
    filters: {
        id: orders.id,
        deliveryStatus: orders.deliveryStatus,
        isSuccess: { column: orders.isSuccess, kind: "boolean" },
        estimatedDelivery: orders.estimatedDelivery,
        trackingNumber: orders.trackingNumber,
        createdAt: { column: orders.createdAt, kind: "date" },
        updatedAt: { column: orders.updatedAt, kind: "date" },
    },
    sort: {
        id: orders.id,
        deliveryStatus: orders.deliveryStatus,
        isSuccess: orders.isSuccess,
        estimatedDelivery: orders.estimatedDelivery,
        trackingNumber: orders.trackingNumber,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
    },
});
