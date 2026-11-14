import { cookieHeader, readResponse, StoreApiError, storeOrigin } from "./http";
import { getResponseCSRFToken } from "./getCSRFToken";

export async function refreshAccessToken(
    refreshToken: string,
    csrfToken: string,
) {
    const response = await fetch(new URL("/api/auth/refresh", storeOrigin()), {
        method: "POST",
        cache: "no-store",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookieHeader({
                refreshToken,
                csrfToken,
            }),
            "X-CSRF-Token": csrfToken,
        },
        body: "{}",
    });

    if ([400, 401, 403].includes(response.status)) {
        return null;
    }

    const data = await readResponse<{
        accessToken: string;
        refreshToken: string;
    }>(response);

    if (!data.accessToken || !data.refreshToken) {
        throw new StoreApiError(502, "Invalid refresh response.");
    }

    return {
        ...data,
        csrfToken: getResponseCSRFToken(response.headers),
    };
}
