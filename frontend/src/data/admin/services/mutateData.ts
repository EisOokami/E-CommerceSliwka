import "server-only";

import { ZodType } from "zod";
import { adminRequest } from "./server";
import { actionResult } from "./actionResult";
import { AdminApiError } from "./errors";
import {
    productSchema,
    orderSchema,
    userSchema,
    adminCreateSchema,
    adminUpdateSchema,
    settingsSchema,
} from "../../../lib/schemas/admin/panel";
import {
    categorySchema,
    couponSchema,
    reviewModerationSchema,
} from "../../../lib/schemas/admin/catalog";
import { reauthSchema } from "../../../lib/schemas/admin/auth";
import { payloadSchema, uuidSchema } from "@/lib/schemas/schemas";

export async function mutateData<T = unknown>(
    method: string,
    path: string,
    payload?: unknown,
) {
    return actionResult(async () => {
        const [, resource, id, subresource, sessionId] = path.split("/");

        if (id) {
            uuidSchema.parse(decodeURIComponent(id));
        }

        if (sessionId) {
            uuidSchema.parse(decodeURIComponent(sessionId));
        }

        if (!["POST", "PATCH", "DELETE"].includes(method)) {
            throw new AdminApiError(400, "Invalid mutation.");
        }

        if (resource === "images" && method === "POST") {
            if (!(payload instanceof FormData)) {
                throw new AdminApiError(400, "Select an image.");
            }

            const file = payload.get("image");

            if (
                !(file instanceof File) ||
                !["image/jpeg", "image/png", "image/webp"].includes(
                    file.type,
                ) ||
                file.size === 0 ||
                file.size > 20 * 1024 * 1024
            ) {
                throw new AdminApiError(
                    400,
                    "Select a JPEG, PNG or WebP image up to 20 MB. The server may enforce a smaller limit.",
                );
            }
        } else {
            const value = payloadSchema.parse(payload);
            const needsReauth =
                method === "DELETE" ||
                resource === "admins" ||
                resource === "settings" ||
                resource === "coupons";

            const reauth = needsReauth
                ? { _reauth: reauthSchema.parse(value._reauth) }
                : {};

            const schemas: Record<string, ZodType> = {
                products: productSchema,
                orders: orderSchema,
                users: userSchema,
                admins:
                    method === "POST" ? adminCreateSchema : adminUpdateSchema,
                settings: settingsSchema,
                categories: categorySchema,
                coupons: couponSchema,
                reviews: reviewModerationSchema,
            };

            if (method === "DELETE") {
                if (
                    ![...Object.keys(schemas), "images"].includes(resource) ||
                    (subresource && subresource !== "sessions")
                ) {
                    throw new AdminApiError(400, "Invalid resource.");
                }

                payload = reauth;
            } else {
                if (!schemas[resource]) {
                    throw new AdminApiError(400, "Invalid resource.");
                }

                payload = {
                    ...(schemas[resource].parse(value) as object),
                    ...reauth,
                };
            }
        }

        return adminRequest<T>(path, {
            method,
            body: payload,
            writeCookies: true,
        });
    });
}
