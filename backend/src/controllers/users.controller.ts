import type { Response } from "express";
import type { IGetUserRequest } from "../types/types.js";
import * as usersService from "../services/users.service.js";
import {
    changePasswordSchema,
    deleteAccountSchema,
    setPasswordSchema,
    userUpdateSchema,
} from "../validators/users.js";
import { validateIdSchema } from "../validators/validators.js";
import { removeUndefined } from "../utils/removeUndefined.js";

export const me = async (req: IGetUserRequest, res: Response) => {
    if (!req.user || !req.user.id) {
        res.status(401).json({
            status: "error",
            message: "Authentication required",
        });

        return;
    }

    const response = await usersService.me(req.user.id);

    res.status(200).json(response);
};

export const acceptTerms = async (req: IGetUserRequest, res: Response) => {
    if (!req.user || !req.user.id) {
        res.status(401).json({
            status: "error",
            message: "Authentication required",
        });

        return;
    }

    const response = await usersService.acceptTerms(req.user.id);

    res.status(200).json(response);
};

export const updateUser = async (req: IGetUserRequest, res: Response) => {
    if (!req.user || !req.user.id) {
        res.status(401).json({
            status: "error",
            message: "Authentication required",
        });

        return;
    }

    const validateData = removeUndefined(userUpdateSchema.parse(req.body));

    const response = await usersService.updateUser(req.user.id, validateData);

    res.status(200).json(response);
};

export const changePassword = async (req: IGetUserRequest, res: Response) => {
    if (!req.user || !req.user.id) {
        res.status(401).json({
            status: "error",
            message: "Authentication required",
        });

        return;
    }

    const validateData = changePasswordSchema.parse(req.body);

    await usersService.changePassword(req.user.id, validateData);

    res.status(200).json({
        status: "success",
        message: "The password has been successfully changed",
    });
};

export const deleteAccount = async (req: IGetUserRequest, res: Response) => {
    if (!req.user || !req.user.id) {
        res.status(401).json({
            status: "error",
            message: "Authentication required",
        });

        return;
    }

    const { id } = validateIdSchema.parse(req.params);

    if (id !== req.user.id) {
        res.status(403).json({
            status: "error",
            message: "You can only delete your own account",
        });

        return;
    }

    const validateData = deleteAccountSchema.parse(req.body ?? {});

    await usersService.deleteAccount(id, validateData);

    res.clearCookie("refreshToken");
    res.clearCookie("csrfToken");

    res.status(200).json({
        status: "success",
        message: "The account has been successfully deleted",
    });
};

export const requestAccountDeletionCode = async (
    req: IGetUserRequest,
    res: Response,
) => {
    if (!req.user || !req.user.id) {
        res.status(401).json({
            status: "error",
            message: "Authentication required",
        });

        return;
    }

    const response = await usersService.requestAccountDeletionCode(req.user.id);

    res.status(200).json(response);
};

export const exportData = async (req: IGetUserRequest, res: Response) => {
    if (!req.user || !req.user.id) {
        res.status(401).json({
            status: "error",
            message: "Authentication required",
        });

        return;
    }

    const data = await usersService.exportData(req.user.id);

    res.setHeader("Cache-Control", "no-store");
    res.status(200).json(data);
};

export const setPassword = async (req: IGetUserRequest, res: Response) => {
    if (!req.user || !req.user.id) {
        res.status(401).json({
            status: "error",
            message: "Authentication required",
        });

        return;
    }

    const validateData = setPasswordSchema.parse(req.body);

    await usersService.setPassword(req.user.id, validateData);

    res.status(200).json({
        status: "success",
        message: "Password set successfully",
    });
};
