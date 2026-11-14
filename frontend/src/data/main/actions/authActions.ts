"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
    authRequest,
    registerUserService,
    loginUserService,
} from "../services/authService";
import { emptyAction, actionFailure } from "../services/actionState";
import type { ILoginAction, IRegisterAction } from "@/interfaces/data";
import {
    codeSchema,
    loginSchema,
    registerSchema,
} from "@/lib/schemas/main/auth";

export async function registerUserAction(
    _previous: IRegisterAction | undefined,
    form: FormData,
): Promise<IRegisterAction> {
    const validateData = registerSchema.safeParse({
        username: form.get("username"),
        email: form.get("email"),
        password: form.get("password"),
        agreeToTermsAndPrivacy: form.get("terms-and-policy"),
    });

    if (!validateData.success) {
        return actionFailure(validateData.error);
    }

    try {
        const response = await registerUserService(validateData.data);

        return {
            ...emptyAction,
            message: response.message,
        };
    } catch (error) {
        return actionFailure(error);
    }
}

export async function loginUserAction(
    _previous: ILoginAction | undefined,
    form: FormData,
): Promise<ILoginAction> {
    const cookieStore = await cookies();

    const challenge = cookieStore.get("customer_mfa")?.value;

    try {
        if (challenge) {
            const code = codeSchema.safeParse(form.get("code"));

            if (!code.success) {
                return {
                    ...emptyAction,
                    requiresMfa: true,
                    zodErrors: {
                        code: ["Enter the six-digit code."],
                    },
                };
            }

            await authRequest("mfa/verify", {
                tempToken: challenge,
                code: code.data,
            });

            cookieStore.delete("customer_mfa");
        }

        if (!challenge) {
            const validateData = loginSchema.safeParse({
                email: form.get("email"),
                password: form.get("password"),
            });

            if (!validateData.success) {
                const { fieldErrors } = z.flattenError(validateData.error);

                return {
                    ...actionFailure(validateData.error),
                    zodErrors: {
                        ...fieldErrors,
                        identifier: fieldErrors.email,
                    },
                };
            }

            const response = await loginUserService(validateData.data);

            if (response.requiresMfa && response.tempToken) {
                cookieStore.set("customer_mfa", response.tempToken, {
                    path: "/",
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict" as const,
                    maxAge: 300,
                });

                return {
                    ...emptyAction,
                    requiresMfa: true,
                    message: "Enter your authenticator code.",
                };
            }
        }
    } catch (error) {
        return {
            ...actionFailure(error, {
                email: "identifier",
            }),

            requiresMfa: !!challenge,
        };
    }

    redirect("/");
}

export async function logoutAction() {
    const cookieStore = await cookies();

    try {
        if (
            cookieStore.get("refreshToken") &&
            !cookieStore.get("accessToken")
        ) {
            await authRequest("refresh");
            await authRequest("logout");
        }

        if (
            cookieStore.get("refreshToken") &&
            cookieStore.get("accessToken")
        ) {
            await authRequest("logout");
        }
    } finally {
        ["accessToken", "refreshToken", "csrfToken", "customer_mfa"].forEach(
            (name) => {
                cookieStore.delete(name);
            },
        );
    }
}
