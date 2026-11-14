import type { NextFunction, Response } from "express";
import type { IAdminRequest } from "../types/types.js";
import * as sessionService from "../services/session.service.js";
import type { Permission } from "../utils/permissions.js";

export async function authenticateAdminSession(
    req: IAdminRequest,
    res: Response,
    next: NextFunction,
) {
    try {
        const rawToken = req.cookies?.["admin_session"];

        if (
            typeof rawToken !== "string" ||
            !/^[A-Za-z0-9_-]{43}$/.test(rawToken)
        ) {
            res.status(401).json({
                status: "error",
                message: "Authentication required",
            });

            return;
        }

        const result = await sessionService.validateAndTouch(rawToken);

        if (!result.valid) {
            res.status(401).json({
                status: "error",
                message: "Session is invalid or has expired",
            });

            return;
        }

        const identity = await sessionService.authenticatedAdmin(
            result.session.adminId,
        );

        if (!identity) {
            res.status(401).json({
                status: "error",
                message: "Account is inactive",
            });

            return;
        }

        req.admin = identity.admin;
        req.adminPermissions = identity.permissions as Permission[];
        req.adminSession = result.session;

        next();
    } catch (error) {
        next(error);
    }
}
