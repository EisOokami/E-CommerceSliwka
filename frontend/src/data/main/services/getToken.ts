import { cookies } from "next/headers";

export async function getAuthToken() {
    const cookieStore = await cookies();

    const authToken = cookieStore.get("accessToken")?.value;

    return authToken;
}

export async function getCSRFToken() {
    const cookieStore = await cookies();

    const authToken = cookieStore.get("csrfToken")?.value;

    return authToken;
}
