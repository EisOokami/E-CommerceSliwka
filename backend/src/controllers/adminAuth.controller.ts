import type { Request, Response } from "express";
import type { IAdminRequest } from "../types/types.js";
import * as adminAuthService from "../services/adminAuth.service.js";
import * as sessionService from "../services/session.service.js";
import * as auditService from "../services/audit.service.js";
import {
    loginSchema,
    verifyMfaSchema,
    passwordSchema,
} from "../validators/adminAuth.js";
import { expressAtMs } from "../utils/auth/adminSessionPolicy.js";
import { allPermissions } from "../utils/permissions.js";
import { z } from "zod";
import { uuidSchema } from "../validators/validators.js";

export const adminLogin = async (req: Request, res: Response) => {
    const validateData = loginSchema.parse(req.body);

    const response = await adminAuthService.adminLogin(
        validateData.email,
        validateData.password,
        req.ip,
        req.get("user-agent")?.slice(0, 512) ?? "unknown",
    );

    if (response.mfaRequired) {
        res.cookie("admin_mfa", response.mfaLoginToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict" as const,
            path: "/api/admin",
            maxAge: 300000,
        });
    }

    if (!response.mfaRequired) {
        res.cookie("admin_session", response.rawToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict" as const,
            path: "/api/admin",
            maxAge: expressAtMs,
        });
    }

    res.status(200).json({ mfaRequired: response.mfaRequired });
};

export const verifyMfa = async (req: Request, res: Response) => {
    const validateData = verifyMfaSchema.parse(req.body);
    const token = z
        .string()
        .regex(/^[A-Za-z0-9_-]{43}$/)
        .parse(req.cookies.admin_mfa);

    res.clearCookie("admin_mfa", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict" as const,
        path: "/api/admin",
    });

    const response = await adminAuthService.verifyMfa(
        token,
        validateData.code,
        req.ip,
        req.get("user-agent")?.slice(0, 512) ?? "unknown",
    );

    res.cookie("admin_session", response.rawToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict" as const,
        path: "/api/admin",
        maxAge: expressAtMs,
    });

    res.status(200).json({ mfaRequired: false });
};

export const logout = async (req: IAdminRequest, res: Response) => {
    if (!req.admin || !req.adminSession) {
        res.status(401).json({
            status: "error",
            message: "Unauthorized",
        });

        return;
    }

    await sessionService.logout(req.admin.id, req.adminSession.id, false, {
        ip: req.ip,
        userAgent: req.get("user-agent")?.slice(0, 512) ?? "unknown",
    });

    res.clearCookie("admin_session", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict" as const,
        path: "/api/admin",
    });

    res.status(200).json({ success: true });
};

export const logoutAll = async (req: IAdminRequest, res: Response) => {
    if (!req.admin || !req.adminSession) {
        res.status(401).json({
            status: "error",
            message: "Unauthorized",
        });

        return;
    }

    await sessionService.logout(req.admin.id, req.adminSession.id, true, {
        ip: req.ip,
        userAgent: req.get("user-agent")?.slice(0, 512) ?? "unknown",
    });

    res.clearCookie("admin_session", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict" as const,
        path: "/api/admin",
    });

    res.status(200).json({ success: true });
};

export const me = async (req: IAdminRequest, res: Response) => {
    if (!req.admin) {
        res.status(401).json({
            status: "error",
            message: "Unauthorized",
        });

        return;
    }

    const data = {
        status: "success",
        id: req.admin.id,
        email: req.admin.email,
        fullName: req.admin.fullName,
        role: req.admin.role,
        mfaEnabled: req.admin.mfaEnabled,
        permissions:
            req.admin.role === "super_admin"
                ? allPermissions
                : req.adminPermissions,
    };

    res.status(200).json(data);
};

export const listSessions = async (req: IAdminRequest, res: Response) => {
    const adminSession = req.adminSession;

    if (!req.admin || !adminSession) {
        res.status(401).json({
            status: "error",
            message: "Unauthorized",
        });

        return;
    }

    const response = await sessionService.listSessions(req.admin.id);

    res.status(200).json(
        response.map((session) => ({
            ...session,
            current: session.id === adminSession.id,
        })),
    );
};

export const revokeSession = async (req: IAdminRequest, res: Response) => {
    if (!req.admin || !req.adminSession) {
        res.status(401).json({
            status: "error",
            message: "Unauthorized",
        });

        return;
    }

    const validatedSessionId = uuidSchema.parse(req.params.sessionId);

    await sessionService.revokeSession(req.admin.id, validatedSessionId, {
        ip: req.ip,
        userAgent: req.get("user-agent")?.slice(0, 512) ?? "unknown",
    });

    if (validatedSessionId === req.adminSession.id) {
        res.clearCookie("admin_session", {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict" as const,
            path: "/api/admin",
        });
    }

    res.status(200).json({ success: true });
};

export const setupMfa = async (req: IAdminRequest, res: Response) => {
    if (!req.admin || !req.adminSession || !req.adminStepUpVersion) {
        res.status(401).json({
            status: "error",
            message: "Unauthorized",
        });

        return;
    }

    const response = await adminAuthService.setupMfa(
        req.admin.id,
        req.admin.email,
        req.adminSession.id,
        req.adminStepUpVersion,
    );

    res.status(200).json(response);
};

export const confirmMfa = async (req: IAdminRequest, res: Response) => {
    if (!req.admin || !req.adminSession || !req.adminStepUpVersion) {
        res.status(401).json({
            status: "error",
            message: "Unauthorized",
        });

        return;
    }

    const validateData = verifyMfaSchema.parse(req.body);

    await adminAuthService.confirmMfa(
        req.admin.id,
        validateData.code,
        {
            ip: req.ip,
            userAgent: req.get("user-agent")?.slice(0, 512) ?? "unknown",
        },
        req.adminSession.id,
        req.adminStepUpVersion,
    );

    res.clearCookie("admin_session", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict" as const,
        path: "/api/admin",
    });

    res.status(200).json({ success: true });
};

export const disableMfa = async (req: IAdminRequest, res: Response) => {
    if (!req.admin || !req.adminSession || !req.adminStepUpVersion) {
        res.status(401).json({
            status: "error",
            message: "Unauthorized",
        });

        return;
    }

    await adminAuthService.changeSecurity(
        req.admin.id,
        "disable-mfa",
        undefined,
        {
            ip: req.ip,
            userAgent: req.get("user-agent")?.slice(0, 512) ?? "unknown",
        },
        req.adminSession.id,
        req.adminStepUpVersion,
    );

    res.clearCookie("admin_session", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict" as const,
        path: "/api/admin",
    });

    res.status(200).json({ success: true });
};

export const changePassword = async (req: IAdminRequest, res: Response) => {
    if (!req.admin || !req.adminSession || !req.adminStepUpVersion) {
        res.status(401).json({
            status: "error",
            message: "Unauthorized",
        });

        return;
    }

    const validateData = passwordSchema.parse(req.body);

    await adminAuthService.changeSecurity(
        req.admin.id,
        "password",
        validateData.password,
        {
            ip: req.ip,
            userAgent: req.get("user-agent")?.slice(0, 512) ?? "unknown",
        },
        req.adminSession.id,
        req.adminStepUpVersion,
    );

    res.clearCookie("admin_session", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict" as const,
        path: "/api/admin",
    });

    res.status(200).json({ success: true });
};

export const securityEvents = async (req: IAdminRequest, res: Response) => {
    if (!req.admin) {
        res.status(401).json({
            status: "error",
            message: "Unauthorized",
        });

        return;
    }

    const response = await auditService.listAudit(
        req.admin.id,
        Math.max(1, Math.min(50, 100)),
    );

    res.status(200).json(response);
};
