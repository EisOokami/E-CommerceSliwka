import "server-only";

import { cookies, headers } from "next/headers";
import { cache } from "react";
import { isIP } from "node:net";
import { AdminApiError } from "./errors";
import type { AdminIdentity } from "@/interfaces/admin/api";
import { uuidSchema } from "@/lib/schemas/schemas";
import { Options } from "@/types/types";

async function receiveCookies(response: Response) {
    const cookieStore = await cookies();

    response.headers.getSetCookie().forEach((line) => {
        const [pair, ...attributes] = line.split(";");
        const separator = pair.indexOf("=");
        const name = pair.slice(0, separator).trim();

        if (
            !["admin_session", "admin_csrf", "admin_mfa"].includes(name) ||
            name === "admin_csrf"
        ) {
            return;
        }

        const values = new Map(
            attributes.map((part) => {
                const at = part.indexOf("=");

                return [
                    part
                        .slice(0, at < 0 ? undefined : at)
                        .trim()
                        .toLowerCase(),
                    at < 0 ? "" : part.slice(at + 1).trim(),
                ];
            }),
        );

        const sameSite = values.get("samesite")?.toLowerCase();

        cookieStore.set(`bff_${name}`, pair.slice(separator + 1), {
            path: "/admin",
            httpOnly: true,
            secure: values.has("secure"),
            sameSite:
                sameSite === "lax" || sameSite === "none" ? sameSite : "strict",
            ...(values.has("max-age")
                ? { maxAge: Number(values.get("max-age")) }
                : {}),
            ...(values.has("expires")
                ? { expires: new Date(values.get("expires")!) }
                : {}),
        });
    });
}

export async function clearLegacyCookies() {
    const cookieStore = await cookies();

    ["admin_session", "admin_csrf", "admin_mfa"].forEach((name) => {
        cookieStore.set(name, "", {
            path: "/api/admin",
            maxAge: 0,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });
    });
}

async function request<T>(path: string, options: Options = {}): Promise<T> {
    if (!/^\/[a-z]/.test(path) || path.includes("..") || path.includes("\\")) {
        throw new AdminApiError(400, "Invalid admin endpoint.");
    }

    const cookieStore = await cookies();
    const incoming = await headers();
    const method = options.method ?? "GET";
    const multipart = options.body instanceof FormData;
    const outgoing: Record<string, string> = {};

    const cookie = ["admin_session", "admin_csrf", "admin_mfa"]
        .flatMap((name) => {
            const value =
                name === "admin_csrf"
                    ? options.csrf
                    : cookieStore.get(`bff_${name}`)?.value;

            if (!value) {
                return [];
            }

            if (/[;\r\n]/.test(value)) {
                throw new AdminApiError(401, "Invalid session.");
            }

            return [name + "=" + value];
        })
        .join("; ");

    if (cookie) {
        outgoing.Cookie = cookie;
    }

    if (!multipart) {
        outgoing["Content-Type"] = "application/json";
    }

    const clientIpHeader = process.env.ADMIN_CLIENT_IP_HEADER;

    if (clientIpHeader) {
        const clientIp = incoming.get(clientIpHeader)?.trim();
        const protocol = incoming.get("x-forwarded-proto");

        if (
            !clientIp ||
            !isIP(clientIp) ||
            !["http", "https"].includes(protocol ?? "")
        ) {
            throw new AdminApiError(
                503,
                "The admin proxy is not configured correctly.",
            );
        }

        outgoing["X-Forwarded-For"] = clientIp;
        outgoing["X-Forwarded-Proto"] = protocol!;
    }

    const userAgent = incoming.get("user-agent");

    if (userAgent) {
        outgoing["User-Agent"] = userAgent.slice(0, 512);
    }

    if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
        const source = incoming.get("origin");

        if (!source) {
            throw new AdminApiError(403, "Request origin is missing.");
        }

        outgoing.Origin = source;
        outgoing["X-CSRF-Token"] = options.csrf ?? "";
    }

    let response: Response;

    try {
        response = await fetch(
            new URL(
                "/api/admin" + path,
                (
                    process.env.ADMIN_API_ORIGIN ??
                    process.env.API_URL ??
                    "http://127.0.0.1:3001"
                ).replace(/\/$/, ""),
            ),
            {
                method,
                headers: outgoing,
                cache: "no-store",
                signal: options.signal,
                ...(options.body === undefined
                    ? {}
                    : {
                          body: multipart
                              ? (options.body as FormData)
                              : JSON.stringify(options.body),
                      }),
            },
        );
    } catch {
        throw new AdminApiError(
            503,
            "The admin service is unavailable. Please retry.",
        );
    }

    if (options.writeCookies) {
        await receiveCookies(response);
    }

    const data =
        response.status === 204
            ? null
            : await response.json().catch(() => {
                  return null;
              });

    if (!response.ok) {
        throw new AdminApiError(
            response.status,
            response.status === 429
                ? "Too many attempts. Please wait before trying again."
                : (data.message ?? "The admin request failed."),
            Array.isArray(data?.details) ? data.details : [],
        );
    }

    if (response.status !== 204 && data === null) {
        throw new AdminApiError(
            502,
            "The admin service returned an invalid response.",
        );
    }

    return data as T;
}

export const requireAdmin = cache(async (): Promise<AdminIdentity> => {
    const cookieStore = await cookies();

    if (!cookieStore.get("bff_admin_session")?.value) {
        throw new AdminApiError(401, "Please sign in.");
    }

    const identity = await request<AdminIdentity>("/auth/me");

    return {
        id: identity.id,
        email: identity.email,
        fullName: identity.fullName,
        role: identity.role,
        mfaEnabled: identity.mfaEnabled,
        permissions: identity.permissions,
    };
});
export async function requirePermissions(permissions: string[], any = false) {
    const admin = await requireAdmin();

    if (
        !(any
            ? permissions.some((permission) => {
                  return admin.permissions.includes(permission);
              })
            : permissions.every((permission) => {
                  return admin.permissions.includes(permission);
              }))
    ) {
        throw new AdminApiError(
            403,
            "You do not have permission to perform this operation.",
        );
    }

    return admin;
}
async function authorize(path: string, method: string) {
    const resource = path.split(/[/?]/)[1];

    if (resource === "auth") {
        await requireAdmin();

        return;
    }

    if (resource === "dashboard") {
        await requirePermissions([
            "products.read",
            "orders.read",
            "users.read",
        ]);

        return;
    }

    if (resource === "product-categories") {
        await requirePermissions(
            ["products.read", "products.create", "products.update"],
            true,
        );

        return;
    }

    if (resource === "images") {
        await requirePermissions(
            method === "GET"
                ? ["products.read"]
                : method === "DELETE"
                  ? ["products.delete"]
                  : ["products.create", "products.update"],
            method === "POST",
        );

        return;
    }

    if (
        ![
            "products",
            "orders",
            "users",
            "admins",
            "settings",
            "categories",
            "coupons",
            "reviews",
        ].includes(resource)
    ) {
        throw new AdminApiError(400, "Unsupported admin resource.");
    }

    const operation =
        method === "GET"
            ? "read"
            : resource === "admins"
              ? "manage"
              : method === "POST"
                ? "create"
                : method === "DELETE"
                  ? "delete"
                  : "update";

    await requirePermissions([resource + "." + operation]);
}
export async function adminRequest<T>(
    path: string,
    options: Options = {},
): Promise<T> {
    const method = options.method ?? "GET";
    const [resource, id] = path.split("?")[0].split("/").slice(1);

    if (
        id &&
        [
            "products",
            "orders",
            "users",
            "admins",
            "categories",
            "coupons",
            "reviews",
            "images",
        ].includes(resource)
    ) {
        uuidSchema.parse(decodeURIComponent(id));
    }

    if (!options.anonymous) {
        await authorize(path, method);
    }

    if (method !== "GET") {
        if (!options.writeCookies) {
            throw new Error("Mutations must run in an action.");
        }

        const token = await request<{ csrfToken: string }>("/auth/csrf");

        if (
            !token ||
            typeof token.csrfToken !== "string" ||
            !/^[A-Za-z0-9_-]{43}\.[a-f0-9]{64}$/.test(token.csrfToken)
        ) {
            throw new AdminApiError(
                502,
                "The admin service returned an invalid CSRF token.",
            );
        }

        options = { ...options, csrf: token.csrfToken };
    }

    return request<T>(path, options);
}
