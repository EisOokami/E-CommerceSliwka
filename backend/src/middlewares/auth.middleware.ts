import type { NextFunction, Response } from "express";
import type { IGetUserRequest } from "../types/types.js";
import { verifyAccessToken } from "../utils/auth/jwt.js";
import * as adminPanelService from "../services/adminPanel.service.js";

export async function authenticateToken(
    req: IGetUserRequest,
    res: Response,
    next: NextFunction,
) {
    try {
        const authHeader = req.headers["authorization"];
        const token =
            typeof authHeader === "string"
                ? authHeader.split(" ")[1]
                : undefined;

        if (!token) {
            res.status(401).json({ status: "error", message: "Token missing" });

            return;
        }

        const { payload } = await verifyAccessToken(token);

        if (
            typeof payload.id !== "string" ||
            !(await adminPanelService.customerCanAuthenticate(payload.id))
        ) {
            res.status(401).json({
                status: "error",
                message: "Account unavailable",
            });

            return;
        }

        req.user = { id: payload.id };

        next();
    } catch {
        res.status(401).json({
            status: "error",
            message: "Invalid or expired token",
        });
    }
}
