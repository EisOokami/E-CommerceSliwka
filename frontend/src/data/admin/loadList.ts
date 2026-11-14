import type { Collection } from "@/interfaces/admin/api";
import { listSchema } from "@/lib/schemas/admin/panel";
import { SearchParams } from "@/types/types";
import { AdminApiError } from "./services/errors";
import { redirect } from "next/navigation";

const statuses: Record<string, string[]> = {
    products: ["visible", "draft", "hidden"],
    orders: ["Processing", "Shipped", "Delivered", "Cancelled"],
    customers: ["active", "blocked"],
    roles: ["active", "inactive"],
    categories: [],
    coupons: ["enabled", "disabled"],
    reviews: ["visible", "hidden"],
};

export async function loadList<T>(
    params: SearchParams,
    route: string,
    loader: (query: string) => Promise<Collection<T>>,
) {
    const input = await params;
    const values = Object.fromEntries(
        Object.entries(input).map(([key, value]) => {
            return [key, Array.isArray(value) ? value[0] : value];
        }),
    );

    const validateData = listSchema.parse(values);

    if (validateData.status && !statuses[route].includes(validateData.status)) {
        throw new AdminApiError(400, "Invalid status filter.");
    }

    if (!["products"].includes(route) && validateData.sort === "price") {
        throw new AdminApiError(400, "Invalid sort field.");
    }

    const query = new URLSearchParams(
        Object.entries(validateData)
            .filter(([, value]) => {
                return value !== undefined;
            })
            .map(([key, value]) => {
                return [key, String(value)];
            }),
    );

    const data = await loader(query.toString());
    const last = Math.max(1, Math.ceil(data.total / validateData.pageSize));

    if (validateData.page > last) {
        query.set("page", String(last));

        redirect("/admin/" + route + "?" + query);
    }

    return data;
}
