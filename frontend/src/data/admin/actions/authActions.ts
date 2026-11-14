"use server";

import { adminRequest, clearLegacyCookies } from "../services/server";
import { actionResult } from "../services/actionResult";
import {
    loginSchema,
    verifyMfaSchema,
    passwordSchema,
    reauthSchema,
    logoutAllSchema,
} from "../../../lib/schemas/admin/auth";
import type { Reauthentication } from "@/interfaces/admin/api";
import { uuidSchema } from "@/lib/schemas/schemas";

export async function adminLoginService(email: string, password: string) {
    return actionResult(async () => {
        const validateData = loginSchema.parse({ email, password });

        await clearLegacyCookies();

        return adminRequest<{ mfaRequired: boolean }>("/auth/login", {
            method: "POST",
            body: validateData,
            writeCookies: true,
            anonymous: true,
        });
    });
}

export async function mfaVerifyService(code: string) {
    return actionResult(() => {
        const validateData = verifyMfaSchema.parse({ code });

        return adminRequest("/auth/verify-mfa", {
            method: "POST",
            body: validateData,
            writeCookies: true,
            anonymous: true,
        });
    });
}

export async function logoutAdmin(all = false) {
    return actionResult(() => {
        return adminRequest(
            logoutAllSchema.parse(all) ? "/auth/logout-all" : "/auth/logout",
            { method: "POST", body: {}, writeCookies: true },
        );
    });
}

export async function revokeAdminSession(id: string) {
    return actionResult(() => {
        return adminRequest("/auth/sessions/" + uuidSchema.parse(id), {
            method: "DELETE",
            body: {},
            writeCookies: true,
        });
    });
}

export async function setupMfa(_reauth: Reauthentication) {
    return actionResult(() => {
        const validateData = reauthSchema.parse(_reauth);

        return adminRequest<{ uri: string }>("/auth/mfa/setup", {
            method: "POST",
            body: { _reauth: validateData },
            writeCookies: true,
        });
    });
}

export async function confirmMfa(code: string, _reauth: Reauthentication) {
    return actionResult(() => {
        const validateVerifyMfaData = verifyMfaSchema.parse({ code });
        const validateReauthData = reauthSchema.parse(_reauth);

        return adminRequest("/auth/mfa/confirm", {
            method: "POST",
            body: {
                ...validateVerifyMfaData,
                _reauth: validateReauthData,
            },
            writeCookies: true,
        });
    });
}

export async function disableMfa(_reauth: Reauthentication) {
    return actionResult(() => {
        const validateData = reauthSchema.parse(_reauth);

        return adminRequest("/auth/mfa/disable", {
            method: "POST",
            body: { _reauth: validateData },
            writeCookies: true,
        });
    });
}

export async function changeAdminPassword(
    password: string,
    _reauth: Reauthentication,
) {
    return actionResult(() => {
        const validatePasswordData = passwordSchema.parse({ password });
        const validateReauthData = reauthSchema.parse(_reauth);

        return adminRequest("/auth/password", {
            method: "POST",
            body: {
                ...validatePasswordData,
                _reauth: validateReauthData,
            },
            writeCookies: true,
        });
    });
}
