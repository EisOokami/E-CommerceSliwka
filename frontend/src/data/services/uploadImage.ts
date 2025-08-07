import { getStrapiURL } from "@/lib/utils";
import { getAuthToken, getCSRFToken } from "./getToken";

export async function uploadImagesToStrapi(images: File[]) {
    if (!Array.isArray(images) || images.length === 0 || !images[0].size) {
        return null;
    }

    const baseUrl = getStrapiURL();
    const authToken = await getAuthToken();
    const csrfToken = await getCSRFToken();
    const url = new URL("/api/upload", baseUrl);

    if (!authToken) throw new Error("No auth token found");
    if (!csrfToken) throw new Error("No CSRF token found");

    const uploadFormData = new FormData();
    images.forEach((file) => uploadFormData.append("files", file));

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${authToken}`,
                "X-CSRF-Token": csrfToken,
            },
            body: uploadFormData,
        });

        const data = await response.json();

        return data;
    } catch (error) {
        console.log("error", error);
        throw error;
    }
}
