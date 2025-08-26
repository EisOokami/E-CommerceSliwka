"use server";

import qs from "qs";
import { getAuthToken, getCSRFToken } from "./getToken";
import { getStrapiURL } from "@/lib/utils";

export async function getUserMeLoader() {
    const baseUrl = getStrapiURL();

    const url = new URL("/api/users/me", baseUrl);

    const authToken = await getAuthToken();
    const CSRFToken = await getCSRFToken();

    if (!authToken) {
        return { ok: false, data: null, error: null };
    }

    if (!CSRFToken) {
        return { ok: false, data: null, error: null };
    }

    url.search = qs.stringify({
        populate: {
            productsCart: {
                populate: "*",
            },
            orders: {
                fields: ["cartItems", "deliveryStatus", "isSuccess"],
            },
            avatar: {
                fields: ["url", "alternativeText"],
            },
        },
    });

    try {
        const response = await fetch(url.href, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
        });

        const data = await response.json();

        if (data.error) {
            return { ok: false, data: null, error: data.error };
        }

        return { ok: true, data: data, error: null };
    } catch (error) {
        console.log(error);
        return { ok: false, data: null, error: error };
    }
}
