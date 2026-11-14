import "server-only";

import type {
    Category,
    Coupon,
    ManagedReview,
    ProductImage,
} from "@/interfaces/admin/catalog";
import type { Collection } from "@/interfaces/admin/api";
import { adminRequest } from "../services/server";

export function getCategories(query = "", signal?: AbortSignal) {
    return adminRequest<Collection<Category>>("/categories?" + query, {
        signal,
    });
}

export function getCoupons(query = "", signal?: AbortSignal) {
    return adminRequest<Collection<Coupon>>("/coupons?" + query, {
        signal,
    });
}

export function getManagedReviews(query = "", signal?: AbortSignal) {
    return adminRequest<Collection<ManagedReview>>("/reviews?" + query, {
        signal,
    });
}

export function getCategory(id: string, signal?: AbortSignal) {
    return adminRequest<Category>("/categories/" + encodeURIComponent(id), {
        signal,
    });
}

export function getCoupon(id: string, signal?: AbortSignal) {
    return adminRequest<Coupon>("/coupons/" + encodeURIComponent(id), {
        signal,
    });
}

export function getProductImages() {
    return adminRequest<ProductImage[]>("/images");
}
