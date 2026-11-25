import "server-only";

import { ApiFieldError } from "@/interfaces/data";

export class StoreApiError extends Error {
    constructor(
        public status: number,
        message: string,
        public details: ApiFieldError[] = [],
        public data: unknown = undefined,
    ) {
        super(message);
        this.name = "StoreApiError";
    }
}

export function storeOrigin() {
    return (
        process.env.API_URL ??
        process.env.ADMIN_API_ORIGIN ??
        "http://127.0.0.1:3001"
    ).replace(/\/$/, "");
}

function isIpAddress(value: string) {
    if (
        /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/.test(
            value,
        )
    ) {
        return true;
    }

    if (!value.includes(":") || !/^[0-9a-fA-F:.]+$/.test(value)) {
        return false;
    }

    try {
        return new URL("http://[" + value + "]").hostname.length > 0;
    } catch {
        return false;
    }
}

export function forwardedClientIp(incoming: Headers): Record<string, string> {
    const header =
        process.env.CLIENT_IP_HEADER ?? process.env.ADMIN_CLIENT_IP_HEADER;

    if (!header) {
        return {};
    }

    const clientIp = incoming.get(header)?.split(",").pop()?.trim();

    if (!clientIp || !isIpAddress(clientIp)) {
        return {};
    }

    return {
        "X-Forwarded-For": clientIp,
    };
}

export async function readResponse<T>(response: Response): Promise<T> {
    if (response.status === 204 && response.ok) {
        return undefined as T;
    }

    const data = await response.json().catch(() => {
        return null;
    });

    if (!response.ok) {
        const details = Array.isArray(data?.details)
            ? data.details.filter((item: ApiFieldError) => {
                  return (
                      typeof item?.field === "string" &&
                      typeof item?.message === "string"
                  );
              })
            : [];

        throw new StoreApiError(
            response.status,
            typeof data?.message === "string"
                ? data.message
                : "The store service is unavailable.",
            details,
            data?.data,
        );
    }

    if (data === null) {
        throw new StoreApiError(
            502,
            "The store service returned an invalid response.",
        );
    }

    return data as T;
}

export function responseCookie(
    headers: Headers,
    name: string,
): string | undefined {
    const values =
        typeof headers.getSetCookie === "function"
            ? headers.getSetCookie()
            : [headers.get("set-cookie") ?? ""];

    for (const value of values) {
        const match = value.match(
            new RegExp("(?:^|,\\s*)" + name + "=([^;]*)"),
        );

        if (match) {
            return decodeURIComponent(match[1]);
        }
    }
}

export function cookieHeader(values: Record<string, string | undefined>) {
    return Object.entries(values)
        .filter(([, value]) => {
            return value !== undefined;
        })
        .map(([name, value]) => {
            return name + "=" + encodeURIComponent(value!);
        })
        .join("; ");
}
