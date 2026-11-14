"use client";

import * as actions from "./catalogActions";
import { unwrapAction } from "../services/client";

export const saveCategory = (
    ...args: Parameters<typeof actions.saveCategory>
) => {
    return unwrapAction(actions.saveCategory(...args));
};

export const saveCoupon = (...args: Parameters<typeof actions.saveCoupon>) => {
    return unwrapAction(actions.saveCoupon(...args));
};

export const deleteCatalogRecord = (
    ...args: Parameters<typeof actions.deleteCatalogRecord>
) => {
    return unwrapAction(actions.deleteCatalogRecord(...args));
};

export const moderateReview = (
    ...args: Parameters<typeof actions.moderateReview>
) => {
    return unwrapAction(actions.moderateReview(...args));
};

export const uploadProductImage = (
    ...args: Parameters<typeof actions.uploadProductImage>
) => {
    return unwrapAction(actions.uploadProductImage(...args));
};

export const deleteProductImage = (
    ...args: Parameters<typeof actions.deleteProductImage>
) => {
    return unwrapAction(actions.deleteProductImage(...args));
};
