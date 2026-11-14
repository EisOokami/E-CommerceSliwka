import "server-only";

import { cookies, headers } from "next/headers";
import {
    cookieHeader,
    forwardedClientIp,
    readResponse,
    StoreApiError,
    storeOrigin,
} from "./http";
import { getResponseCSRFToken } from "./getCSRFToken";
import { AuthResponse } from "@/interfaces/data";

export async function authRequest(
    path: string,
    body?: unknown,
): Promise<AuthResponse> {
    const cookieStore = await cookies();
    const incoming = await headers();
    const csrf = cookieStore.get("csrfToken")?.value;
    const refresh = cookieStore.get("refreshToken")?.value;
    const access = cookieStore.get("accessToken")?.value;

    let response: Response;

    try {
        response = await fetch(new URL("/api/auth/" + path, storeOrigin()), {
            method: "POST",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
                ...(access
                    ? {
                          Authorization: "Bearer " + access,
                      }
                    : {}),
                ...forwardedClientIp(incoming),
                ...(csrf
                    ? {
                          "X-CSRF-Token": csrf,
                      }
                    : {}),
                Cookie: cookieHeader({
                    csrfToken: csrf,
                    refreshToken: refresh,
                }),
            },
            body: JSON.stringify(body ?? {}),
        });
    } catch {
        throw new StoreApiError(
            503,
            "Authentication service is unavailable. Please try again.",
        );
    }

    const data = await readResponse<AuthResponse>(response);

    if (data.accessToken && data.refreshToken) {
        const csrfValue = getResponseCSRFToken(response.headers);

        cookieStore.set("accessToken", data.accessToken, {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict" as const,
            maxAge: 15 * 60,
        });
        cookieStore.set("refreshToken", data.refreshToken, {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict" as const,
            maxAge: 7 * 86400,
        });
        cookieStore.set("csrfToken", csrfValue, {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict" as const,
            maxAge: 7 * 86400,
        });
    } else if (
        ["login", "mfa/verify", "refresh"].includes(path) &&
        !data.requiresMfa
    ) {
        throw new StoreApiError(502, "Invalid authentication response.");
    }

    return data;
}

export async function registerUserService(body: {
    username: string;
    email: string;
    password: string;
}) {
    return authRequest("register", {
        username: body.username,
        email: body.email,
        password: body.password,
    });
}

export async function loginUserService(body: {
    email: string;
    password: string;
}) {
    return authRequest("login", body);
}
