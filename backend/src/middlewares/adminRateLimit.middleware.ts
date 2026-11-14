import type { Request, Response, NextFunction } from "express";
import * as loginAttemptsService from "../services/loginAttempts.service.js";

export function adminCredentialLimit(
    count: number,
    time: number,
    nextArg?: NextFunction,
) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const result = await loginAttemptsService.reserveIp(
            req.ip ?? "unknown",
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
