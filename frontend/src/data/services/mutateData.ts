import { getAuthToken, getCSRFToken } from "./getToken";
import { getStrapiURL } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function mutateData(method: string, path: string, payload?: any) {
    const baseUrl = getStrapiURL();
    const authToken = await getAuthToken();
    const csrfToken = await getCSRFToken();
    const url = new URL(path, baseUrl);

    if (!authToken) throw new Error("No auth token found");
    if (!csrfToken) throw new Error("No CSRF token found");

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
                "X-CSRF-Token": csrfToken,
            },
            body: JSON.stringify({ ...payload }),
        });

        if (method === "DELETE") {
            return response.ok;
        }

        const data = await response?.json();

        return data;
    } catch (error) {
        console.log("error", error);
        throw error;
    }
}
