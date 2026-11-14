"use server";

import { storeRequest, StoreApiError } from "./client";
import { getAuthToken } from "./getToken";
import { user } from "./adapters";
import { UserDto } from "@/interfaces/data";

export async function getUserMeLoader() {
    if (!(await getAuthToken())) {
        return {
            ok: false as const,
            data: null,
            error: null,
        };
    }

    try {
        const result = await storeRequest<{
            user: UserDto;
        }>("/api/users/me", {
            authenticated: true,
        });

        return {
            ok: true as const,
            data: user(result.user),
            error: null,
        };
    } catch (error) {
        if (error instanceof StoreApiError && error.status === 401) {
            return {
                ok: false as const,
                data: null,
                error: error.message,
            };
        }

        throw error;
    }
}
