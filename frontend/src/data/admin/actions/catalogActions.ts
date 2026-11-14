"use server";

import type {
    Category,
    Coupon,
    ProductImage,
} from "@/interfaces/admin/catalog";
import type { Reauthentication } from "@/interfaces/admin/api";
import { mutateData } from "../services/mutateData";

export async function saveCategory(data: Omit<Category, "id">, id?: string) {
    return mutateData(
        id ? "PATCH" : "POST",
        "/categories" + (id ? "/" + encodeURIComponent(id) : ""),
        data,
    );
}

export async function saveCoupon(
    data: Omit<Coupon, "id">,
    _reauth: Reauthentication,
    id?: string,
) {
    return mutateData(
        id ? "PATCH" : "POST",
        "/coupons" + (id ? "/" + encodeURIComponent(id) : ""),
        {
            ...data,
            _reauth,
        },
    );
}

export async function deleteCatalogRecord(
    resource: "categories" | "coupons" | "reviews",
    id: string,
    _reauth: Reauthentication,
) {
    if (!["categories", "coupons", "reviews"].includes(resource)) {
        return {
            ok: false as const,
            error: {
                status: 400,
                message: "Invalid catalog resource.",
                details: [],
            },
        };
    }

    return mutateData("DELETE", "/" + resource + "/" + encodeURIComponent(id), {
        _reauth,
    });
}

export async function moderateReview(id: string, visible: boolean) {
    return mutateData("PATCH", "/reviews/" + encodeURIComponent(id), {
        visible,
    });
}

export async function uploadProductImage(file: File) {
    const body = new FormData();

    body.append("image", file);

    return mutateData<ProductImage>("POST", "/images", body);
}

export async function deleteProductImage(
    id: string,
    _reauth: Reauthentication,
) {
    return mutateData("DELETE", "/images/" + encodeURIComponent(id), {
        _reauth,
    });
}
