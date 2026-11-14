import { Router } from "express";
import type { Resource } from "../validators/adminPanel.js";
import { requirePermission } from "../middlewares/permission.middleware.js";
import { requireStepUp } from "../middlewares/adminStepUp.middleware.js";
import type { Permission } from "../utils/permissions.js";
import { authenticateAdminSession } from "../middlewares/adminAuth.middleware.js";
import {
    adminSessions,
    dashboard,
    detail,
    list,
    mutate,
    revokeAdminSession,
    settings,
    updateSettings,
} from "../controllers/adminPanel.controller.js";
import rateLimit from "express-rate-limit";

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

const revokeAdminSessionLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    message: {
        status: 429,
        error: "Too many requests",
        message: "Too many requests. Please try again in 1 hour.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const updateSettingsLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    message: {
        status: 429,
        error: "Too many requests",
        message: "Too many requests. Please try again in 1 hour.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const router = Router();

router.get(
    "/dashboard",
    authenticateAdminSession,
    requirePermission("orders.read"),
    requirePermission("products.read"),
    requirePermission("users.read"),
    dashboard,
);
for (const resource of [
    "products",
    "orders",
    "users",
    "admins",
] as Resource[]) {
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
        if (
            (resource === "orders" && operation !== "update") ||
            (resource === "users" && operation === "create")
        ) {
            continue;
        }

        const permission = (
            resource === "admins" ? "admins.manage" : `${resource}.${operation}`
        ) as Permission;
        const path = `/${resource}${operation === "create" ? "" : "/:id"}`;
        const guards = [
            requirePermission(permission),
            ...(resource === "admins" || operation === "delete"
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
router.get(
    "/admins/:id/sessions",
    authenticateAdminSession,
    requirePermission("admins.read"),
    adminSessions,
);
router.delete(
    "/admins/:id/sessions/:sessionId",
    revokeAdminSessionLimiter,
    authenticateAdminSession,
    requirePermission("admins.manage"),
    requireStepUp,
    revokeAdminSession,
);
router.get(
    "/settings",
    authenticateAdminSession,
    requirePermission("settings.read"),
    settings,
);
router.patch(
    "/settings",
    updateSettingsLimiter,
    authenticateAdminSession,
    requirePermission("settings.update"),
    requireStepUp,
    updateSettings,
);

export default router;
