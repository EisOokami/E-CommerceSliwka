import { startAdminSessionCleanup } from "./adminSessionCleanup.js";
import * as ordersService from "../services/orders.service.js";

export async function reconcileCheckouts() {
    for (const order of await ordersService.pendingCheckouts()) {
        try {
            await ordersService.confirm(order.userId, order.stripeId);
        } catch {
            console.error("Checkout reconciliation failed; will retry");
        }
    }
}

export const startCheckoutReconciliation = () => {
    return startAdminSessionCleanup(60000, reconcileCheckouts);
};
