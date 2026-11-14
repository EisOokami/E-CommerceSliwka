"use server";

import { mutateData } from "../services/mutateData";
import type {
    ProductInput,
    OrderStatus,
    AdminInput,
    StoreSettings,
    Reauthentication,
} from "@/interfaces/admin/api";

export async function saveProduct(input: ProductInput, id?: string) {
    return mutateData<{
        id: string;
    }>(
        id ? "PATCH" : "POST",
        "/products" + (id ? "/" + encodeURIComponent(id) : ""),
        input,
    );
}

export async function deleteProduct(id: string, _reauth: Reauthentication) {
    return mutateData("DELETE", "/products/" + encodeURIComponent(id), {
        _reauth,
    });
}

export async function updateOrder(id: string, deliveryStatus: OrderStatus) {
    return mutateData("PATCH", "/orders/" + encodeURIComponent(id), {
        deliveryStatus,
    });
}

export async function updateCustomer(id: string, blocked: boolean) {
    return mutateData("PATCH", "/users/" + encodeURIComponent(id), { blocked });
}

export async function deleteCustomer(id: string, _reauth: Reauthentication) {
    return mutateData("DELETE", "/users/" + encodeURIComponent(id), {
        _reauth,
    });
}

export async function saveAdmin(
    input: AdminInput,
    _reauth: Reauthentication,
    id?: string,
) {
    return mutateData<{
        id: string;
    }>(
        id ? "PATCH" : "POST",
        "/admins" + (id ? "/" + encodeURIComponent(id) : ""),
        { ...input, _reauth },
    );
}

export async function deleteAdmin(id: string, _reauth: Reauthentication) {
    return mutateData("DELETE", "/admins/" + encodeURIComponent(id), {
        _reauth,
    });
}

export async function revokeManagedSession(
    id: string,
    sessionId: string,
    _reauth: Reauthentication,
) {
    return mutateData(
        "DELETE",
        "/admins/" +
            encodeURIComponent(id) +
            "/sessions/" +
            encodeURIComponent(sessionId),
        { _reauth },
    );
}

export async function saveSettings(
    input: StoreSettings,
    _reauth: Reauthentication,
) {
    return mutateData<StoreSettings>("PATCH", "/settings", {
        ...input,
        _reauth,
    });
}
