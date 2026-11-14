import "server-only";

import { adminRequest } from "./services/server";
import type {
    Product,
    Order,
    Customer,
    AdminAccount,
    Collection,
    Dashboard,
    StoreSettings,
} from "@/interfaces/admin/api";

export function getProducts(query = "", signal?: AbortSignal) {
    return adminRequest<Collection<Product>>("/products?" + query, {
        signal,
    });
}

export function getOrders(query = "", signal?: AbortSignal) {
    return adminRequest<Collection<Order>>("/orders?" + query, {
        signal,
    });
}

export function getCustomers(query = "", signal?: AbortSignal) {
    return adminRequest<Collection<Customer>>("/users?" + query, {
        signal,
    });
}

export function getAdmins(query = "", signal?: AbortSignal) {
    return adminRequest<Collection<AdminAccount>>("/admins?" + query, {
        signal,
    });
}

export function getProduct(id: string, signal?: AbortSignal) {
    return adminRequest<Product>("/products/" + encodeURIComponent(id), {
        signal,
    });
}

export function getOrder(id: string, signal?: AbortSignal) {
    return adminRequest<Order>("/orders/" + encodeURIComponent(id), {
        signal,
    });
}

export function getCustomer(id: string, signal?: AbortSignal) {
    return adminRequest<Customer>("/users/" + encodeURIComponent(id), {
        signal,
    });
}

export function getAdmin(id: string, signal?: AbortSignal) {
    return adminRequest<AdminAccount>("/admins/" + encodeURIComponent(id), {
        signal,
    });
}

export function getDashboard(signal?: AbortSignal) {
    return adminRequest<Dashboard>("/dashboard", {
        signal,
    });
}

export function getSettings(signal?: AbortSignal) {
    return adminRequest<StoreSettings>("/settings", {
        signal,
    });
}

export async function getProductCategories(signal?: AbortSignal) {
    return adminRequest<
        {
            name: string;
        }[]
    >("/product-categories", {
        signal,
    });
}
