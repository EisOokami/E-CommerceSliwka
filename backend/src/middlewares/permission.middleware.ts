import type { NextFunction, Response } from "express";
import {
    roleImplicitPermissions,
    type Permission,
} from "../utils/permissions.js";
import type { IAdminRequest } from "../types/types.js";
import { ApiError } from "../utils/apiError.js";

function createPermissionGuard(
    permissions: readonly Permission[],
    mode: "any" | "all",
) {
    if (permissions.length === 0) {
        throw new ApiError({
            statusCode: 400,
            message: "At least one permission must be provided",
        });
    }

    const required = [...new Set(permissions)];

    return (req: IAdminRequest, res: Response, next: NextFunction) => {
        if (!req.admin) {
            res.status(401).json({
                status: "error",
                message: "Authentication required",
            });

            return;
        }

        if (roleImplicitPermissions[req.admin.role] === "ALL") {
            next();

            return;
        }

        const granted = new Set(req.adminPermissions ?? []);

        const missing = required.filter(
            (permission) => !granted.has(permission),
        );

        const allowed =
            mode === "any"
                ? missing.length < required.length
                : missing.length === 0;

        if (allowed) {
            next();

            return;
        }

        res.status(403).json({
            status: "error",
            message:
                mode === "any"
                    ? `Missing required permission: one of [${required.join(", ")}]`
                    : `Missing required permissions: ${missing.join(", ")}`,
        });
    };
}

export const requirePermission = (...permissions: Permission[]) => {
    return createPermissionGuard(permissions, "any");
};

export const requireAllPermissions = (...permissions: Permission[]) => {
    return createPermissionGuard(permissions, "all");
};
