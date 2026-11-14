"use server";

import { z } from "zod";
import { storeRequest, StoreApiError } from "../services/client";
import { mutateData } from "../services/mutateData";
import {
    emailSchema,
    recoverAccountSchema,
    recoveryModeSchema,
    tokenSchema,
} from "@/lib/schemas/main/accountRecovery";
import { RecoveryMode } from "@/types/types";

export interface RecoveryState {
    ok: boolean;
    message: string | null;
}

export async function recoverAccount(
    mode: RecoveryMode,
    token: string,
    id: string,
    _state: RecoveryState,
    form: FormData,
): Promise<RecoveryState> {
    try {
        recoveryModeSchema.parse(mode);

        let message: string;

        if (mode === "verify") {
            const result = await storeRequest<{
                message: string;
            }>(
                "/api/auth/verify-email?" +
                    new URLSearchParams({
                        token: tokenSchema.parse(token),
                    }),
            );

            message = result.message;
        } else if (mode === "reset") {
            const validateData = recoverAccountSchema.parse({
                token,
                id,
                password: form.get("password"),
                confirmation: form.get("confirmation"),
            });

            await mutateData(
                "POST",
                "/api/auth/reset-password",
                {
                    token: validateData.token,
                    id: validateData.id,
                    password: validateData.password,
                },
                false,
            );

            message =
                "Password updated. You can now sign in with your new password.";
        } else {
            const email = emailSchema.parse(form.get("email"));

            const result = await mutateData<{
                message: string;
            }>(
                "POST",
                mode === "forgot"
                    ? "/api/auth/forgot-password"
                    : "/api/auth/resend-verification",
                {
                    email,
                },
                false,
            );

            message = result.message;
        }

        return {
            ok: true,
            message,
        };
    } catch (error) {
        return {
            ok: false,
            message:
                error instanceof z.ZodError
                    ? (error.issues[0].message ?? "Invalid data.")
                    : error instanceof StoreApiError
                      ? error.message
                      : "Account service is unavailable. Please try again.",
        };
    }
}
