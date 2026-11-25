"use server";

import { revalidatePath } from "next/cache";
import { mutateData } from "../services/mutateData";
import { StoreApiError } from "../services/http";

export async function acceptTermsAction(): Promise<{
    ok: boolean;
    message: string;
}> {
    try {
        const result = await mutateData<{ message?: string }>(
            "POST",
            "/api/users/me/accept-terms",
            { acceptTerms: true },
        );

        revalidatePath("/", "layout");

        return { ok: true, message: result?.message ?? "" };
    } catch (error) {
        return {
            ok: false,
            message:
                error instanceof StoreApiError
                    ? error.message
                    : "The store service is unavailable. Please try again.",
        };
    }
}
