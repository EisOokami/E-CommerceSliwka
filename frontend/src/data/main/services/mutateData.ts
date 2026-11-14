import { storeRequest } from "./client";

export async function mutateData<T>(
    method: "POST" | "PUT" | "PATCH" | "DELETE",
    path: string,
    payload?: unknown,
    authenticated = true,
): Promise<T> {
    return storeRequest<T>(path, {
        method,
        body: payload,
        authenticated,
    });
}
