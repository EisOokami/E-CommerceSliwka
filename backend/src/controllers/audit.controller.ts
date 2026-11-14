import type { Request, Response } from "express";
import * as auditService from "../services/audit.service.js";
import { limitSchema } from "../validators/audit.js";

export const listRecentAuditLogs = async (req: Request, res: Response) => {
    const limit = limitSchema.parse(req.query.limit);

    const response = await auditService.listAudit(
        undefined,
        Math.max(1, Math.min(limit, 100)),
    );

    res.status(200).json(response);
};
