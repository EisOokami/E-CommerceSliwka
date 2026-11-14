import { cookies, headers } from "next/headers";
import {
    cookieHeader,
    forwardedClientIp,
    readResponse,
    StoreApiError,
    storeOrigin,
} from "./http";
import { RequestOptions } from "@/interfaces/data";
export { StoreApiError, storeOrigin } from "./http";

export async function storeRequest<T>(
    path: string,
    options: RequestOptions = {},
): Promise<T> {
    const cookieStore = await cookies();
    const incoming = await headers();
    const token = cookieStore.get("accessToken")?.value;
    const csrf = cookieStore.get("csrfToken")?.value;

    const method = options.method ?? "GET";

    if (options.authenticated && !token) {
        throw new StoreApiError(401, "Please sign in.");
    }

    if (
        options.authenticated &&
        !["GET", "HEAD", "OPTIONS"].includes(method) &&
        !csrf
    ) {
        throw new StoreApiError(
            403,
            "Session protection is missing. Please sign in again.",
        );
    }

    const multipart = options.body instanceof FormData;

    let response: Response;

    try {
        response = await fetch(new URL(path, storeOrigin()), {
            method,
            cache: "no-store",
            headers: {
                ...(!multipart
                    ? {
                          "Content-Type": "application/json",
                      }
                    : {}),
                ...(token
                    ? {
                          Authorization: "Bearer " + token,
                      }
                    : {}),
                ...forwardedClientIp(incoming),
                ...(csrf
                    ? {
                          Cookie: cookieHeader({
                              csrfToken: csrf,
                          }),
                          "X-CSRF-Token": csrf,
                      }
                    : {}),
            },
            ...(options.body === undefined
                ? {}
                : {
                      body: multipart
                          ? (options.body as FormData)
                          : JSON.stringify(options.body),
                  }),
        });
    } catch {
        throw new StoreApiError(
            503,
            "The store service is unavailable. Please try again.",
        );
    }

    return readResponse<T>(response);
}
