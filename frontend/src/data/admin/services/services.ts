"use client";

import * as actions from "../actions/authActions";
import { unwrapAction } from "./client";

export const adminLoginService = (
    ...args: Parameters<typeof actions.adminLoginService>
) => {
    return unwrapAction(actions.adminLoginService(...args));
};

export const mfaVerifyService = (
    ...args: Parameters<typeof actions.mfaVerifyService>
) => {
    return unwrapAction(actions.mfaVerifyService(...args));
};

export const logoutAdmin = (
    ...args: Parameters<typeof actions.logoutAdmin>
) => {
    return unwrapAction(actions.logoutAdmin(...args));
};

export const revokeAdminSession = (
    ...args: Parameters<typeof actions.revokeAdminSession>
) => {
    return unwrapAction(actions.revokeAdminSession(...args));
};

export const setupMfa = (...args: Parameters<typeof actions.setupMfa>) => {
    return unwrapAction(actions.setupMfa(...args));
};

export const confirmMfa = (...args: Parameters<typeof actions.confirmMfa>) => {
    return unwrapAction(actions.confirmMfa(...args));
};

export const disableMfa = (...args: Parameters<typeof actions.disableMfa>) => {
    return unwrapAction(actions.disableMfa(...args));
};

export const changeAdminPassword = (
    ...args: Parameters<typeof actions.changeAdminPassword>
) => {
    return unwrapAction(actions.changeAdminPassword(...args));
};
