import type { Response, NextFunction } from "express";
import type { IAdminRequest } from "../types/types.js";
import { reauthSchema } from "../validators/adminAuth.js";
import * as adminAuthService from "../services/adminAuth.service.js";
import { adminCredentialLimit } from "./adminRateLimit.middleware.js";
import { ApiError } from "../utils/apiError.js";

export async function requireStepUp(
    req: IAdminRequest,
    res: Response,
    next: NextFunction,
) {
    if (!req.admin || !req.adminSession) {
        throw new ApiError({ statusCode: 401, message: "Unauthorized" });
    }

    if (!req.body._reauth) {
        throw new ApiError({ statusCode: 403, message: "STEP_UP_REQUIRED" });
    }

    const allowed = await new Promise<boolean>((resolve, reject) => {
        adminCredentialLimit("step-up", 5, 60 * 60000, () => resolve(true))(
            req,
            res,
            next,
        )
            .then(() => resolve(false))
            .catch(reject);
    });

    if (!allowed) {
        return;
    }

    const credentials = reauthSchema.parse(req.body._reauth);

    req.adminStepUpVersion = await adminAuthService.reauthenticate(
        req.admin.id,
        req.adminSession.id,
        credentials.password,
        credentials.code ?? "",
        { ip: req.ip, userAgent: req.get("user-agent") },
    );

    delete req.body._reauth;

    next();
}
