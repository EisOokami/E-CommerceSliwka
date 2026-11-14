import { Router } from "express";
import { requirePermission } from "../middlewares/permission.middleware.js";
import { authenticateAdminSession } from "../middlewares/adminAuth.middleware.js";
import { listRecentAuditLogs } from "../controllers/audit.controller.js";
import { permissions } from "../utils/permissions.js";

const router = Router();

router.get(
    "/",
    authenticateAdminSession,
    requirePermission(permissions.SETTINGS_READ),
    listRecentAuditLogs,
);

export default router;
