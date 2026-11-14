import type { Response, NextFunction } from "express";
import type { IAdminRequest } from "../types/types.js";
import * as loginAttemptsService from "../services/loginAttempts.service.js";

export function adminCredentialLimit(
    scope: "login" | "mfa" | "step-up",
    count: number,
    time: number,
    nextArg?: NextFunction,
) {
    return async (req: IAdminRequest, res: Response, next: NextFunction) => {
        const subject =
            scope === "step-up" && req.admin
                ? "admin:" + req.admin.id
                : (req.ip ?? "unknown");

        const result = await loginAttemptsService.reserveIp(
            scope + ":" + subject,
            time,
        );

        if (result && result.count > count) {
            res.setHeader(
                "Retry-After",
                Math.max(
                    1,
                    Math.ceil((result.resetAt.getTime() - Date.now()) / 1000),
                ),
            );

            res.status(429).json({
                status: "error",
                message: "Too many attempts. Try later",
            });

            return;
        }

        if (nextArg) {
            nextArg();
        }

        if (!nextArg) {
            next();
        }
    };
}
