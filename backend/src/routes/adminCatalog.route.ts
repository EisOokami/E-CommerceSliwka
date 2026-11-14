import { Router } from "express";
import { requirePermission } from "../middlewares/permission.middleware.js";
import { requireStepUp } from "../middlewares/adminStepUp.middleware.js";
import type { Permission } from "../utils/permissions.js";
import { authenticateAdminSession } from "../middlewares/adminAuth.middleware.js";
import rateLimit from "express-rate-limit";
import {
    detail,
    list,
    mutate,
} from "../controllers/adminCatalog.controller.js";

const router = Router();

const createLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    message: {
        status: 429,
        error: "Too many requests",
        message: "Too many requests. Please try again in 15 minutes.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const updateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    message: {
        status: 429,
        error: "Too many requests",
        message: "Too many requests. Please try again in 15 minutes.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const deleteLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    message: {
        status: 429,
        error: "Too many requests",
        message: "Too many requests. Please try again in 15 minutes.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

for (const resource of ["categories", "reviews", "coupons"] as const) {
    router.get(
        `/${resource}`,
        authenticateAdminSession,
        requirePermission(`${resource}.read` as Permission),
        list(resource),
    );
    router.get(
        `/${resource}/:id`,
        authenticateAdminSession,
        requirePermission(`${resource}.read` as Permission),
        detail(resource),
    );

    for (const operation of ["create", "update", "delete"] as const) {
        if (resource === "reviews" && operation === "create") {
            continue;
        }

        const path = `/${resource}${operation === "create" ? "" : "/:id"}`;
        const guards = [
            requirePermission(`${resource}.${operation}` as Permission),
            ...(operation === "delete" || resource === "coupons"
                ? [requireStepUp]
                : []),
        ];

        const handler = mutate(resource, operation);

        if (operation === "create") {
            router.post(
                path,
                createLimiter,
                authenticateAdminSession,
                ...guards,
                handler,
            );
        }

        if (operation === "update") {
            router.patch(
                path,
                updateLimiter,
                authenticateAdminSession,
                ...guards,
                handler,
            );
        }

        if (operation === "delete") {
            router.delete(
                path,
                deleteLimiter,
                authenticateAdminSession,
                ...guards,
                handler,
            );
        }
    }
}

export default router;
