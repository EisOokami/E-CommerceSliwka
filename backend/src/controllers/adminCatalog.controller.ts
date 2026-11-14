import type { Request, Response } from "express";
import * as adminCatalogService from "../services/adminCatalog.service.js";
import {
    catalogListSchema,
    type CatalogResource,
} from "../validators/adminCatalog.js";
import type { IAdminRequest } from "../types/types.js";
import { uuidSchema } from "../validators/validators.js";

export const list = (resource: CatalogResource) => {
    return async (req: Request, res: Response) => {
        const validateData = catalogListSchema.parse(req.query);

        const response = await adminCatalogService.list(resource, validateData);

        res.status(200).json(response);
    };
};

export const detail = (resource: CatalogResource) => {
    return async (req: Request, res: Response) => {
        const validateData = uuidSchema.parse(req.params.id);

        const response = await adminCatalogService.detail(
            resource,
            validateData,
        );

        res.status(200).json(response);
    };
};

export const mutate = (
    resource: CatalogResource,
    operation: "create" | "update" | "delete",
) => {
    return async (req: IAdminRequest, res: Response) => {
        const response = await adminCatalogService.mutate(
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
