"use client";

import * as actions from "./actions";
import { unwrapAction } from "../services/client";

export const saveProduct = (
    ...args: Parameters<typeof actions.saveProduct>
) => {
    return unwrapAction(actions.saveProduct(...args));
};

export const deleteProduct = (
    ...args: Parameters<typeof actions.deleteProduct>
) => {
    return unwrapAction(actions.deleteProduct(...args));
};

export const updateOrder = (
    ...args: Parameters<typeof actions.updateOrder>
) => {
    return unwrapAction(actions.updateOrder(...args));
};

export const updateCustomer = (
    ...args: Parameters<typeof actions.updateCustomer>
) => {
    return unwrapAction(actions.updateCustomer(...args));
};

export const deleteCustomer = (
    ...args: Parameters<typeof actions.deleteCustomer>
) => {
    return unwrapAction(actions.deleteCustomer(...args));
};

export const saveAdmin = (...args: Parameters<typeof actions.saveAdmin>) => {
    return unwrapAction(actions.saveAdmin(...args));
};

export const deleteAdmin = (
    ...args: Parameters<typeof actions.deleteAdmin>
) => {
    return unwrapAction(actions.deleteAdmin(...args));
};

export const revokeManagedSession = (
    ...args: Parameters<typeof actions.revokeManagedSession>
) => {
    return unwrapAction(actions.revokeManagedSession(...args));
};

export const saveSettings = (
    ...args: Parameters<typeof actions.saveSettings>
) => {
    return unwrapAction(actions.saveSettings(...args));
};

export const autofillProduct = (
    ...args: Parameters<typeof actions.autofillProduct>
) => {
    return unwrapAction(actions.autofillProduct(...args));
};

export const generateProductDescription = (
    ...args: Parameters<typeof actions.generateProductDescription>
) => {
    return unwrapAction(actions.generateProductDescription(...args));
};
