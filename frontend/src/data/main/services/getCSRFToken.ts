import { responseCookie, StoreApiError } from "./http";

export function getResponseCSRFToken(headers: Headers): string {
    const token = responseCookie(headers, "csrfToken");

    if (!token) {
        throw new StoreApiError(502, "Missing session protection.");
    }

    return token;
}
