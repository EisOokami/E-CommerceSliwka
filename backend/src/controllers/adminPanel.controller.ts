import type { Request, Response } from "express";
import * as adminPanelService from "../services/adminPanel.service.js";
import * as sessionService from "../services/session.service.js";
import { listSchema, type Resource } from "../validators/adminPanel.js";
import type { IAdminRequest } from "../types/types.js";
import { uuidSchema } from "../validators/validators.js";

export const list = (resource: Resource) => {
    return async (req: Request, res: Response) => {
        const validateData = listSchema.parse(req.query);

        const response = await adminPanelService.list(resource, validateData);

        res.status(200).json(response);
    };
};

export const detail = (resource: Resource) => {
    return async (req: Request, res: Response) => {
        const validateData = uuidSchema.parse(req.params.id);

        const response = await adminPanelService.detail(resource, validateData);

        res.status(200).json(response);
    };
};

export const mutate = (
    resource: Resource,
    operation: "create" | "update" | "delete",
) => {
    return async (req: IAdminRequest, res: Response) => {
        const response = await adminPanelService.mutate(
            resource,
            operation,
            operation === "create"
                ? undefined
                : uuidSchema.parse(req.params.id),
            req.body,
            req,
        );

        res.status(operation === "create" ? 201 : 200).json(response);
    };
};

export async function dashboard(req: Request, res: Response) {
    const result = await adminPanelService.dashboard();

    res.status(200).json(result);
}

export async function settings(req: Request, res: Response) {
    const result = await adminPanelService.settings();

    res.status(200).json(result);
}

export async function updateSettings(req: IAdminRequest, res: Response) {
    const result = await adminPanelService.updateSettings(req.body, req);

    res.status(200).json(result);
}

export async function adminSessions(req: Request, res: Response) {
    const validateData = uuidSchema.parse(req.params.id);

    const result = await sessionService.listSessions(validateData);

    res.status(200).json(result);
}

export async function revokeAdminSession(req: IAdminRequest, res: Response) {
    const validateId = uuidSchema.parse(req.params.id);
    const validateSessionId = uuidSchema.parse(req.params.sessionId);

    await adminPanelService.revokeAdminSession(
        validateId,
        validateSessionId,
        req,
    );

    res.status(200).json({ success: true });
}
