import type { Response } from "express";
import type { IGetUserRequest } from "../types/types.js";
import { validateIdSchema } from "../validators/validators.js";
import * as uploadsService from "../services/uploads.service.js";
import { fileDeleteSchema, fileInsertSchema } from "../validators/uploads.js";

export const uploadSingle = async (req: IGetUserRequest, res: Response) => {
    if (!req.user || !req.user.id) {
        res.status(401).json({
            status: "error",
            message: "Authentication required",
        });

        return;
    }

    if (!req.file) {
        res.status(400).json({
            status: "error",
            message: "Image is required",
        });

        return;
    }

    const validateData = fileInsertSchema.parse(req.body);

    const response = await uploadsService.uploadSingle(
        req.user.id,
        validateData.reviewId,
        req.file,
        validateData.field,
    );

    res.status(201).json({
        data: response,
    });
};

export const uploadMultiple = async (req: IGetUserRequest, res: Response) => {
    if (!req.user || !req.user.id) {
        res.status(401).json({
            status: "error",
            message: "Authentication required",
        });

        return;
    }

    const validateData = fileInsertSchema.parse(req.body);

    const response = await uploadsService.uploadMultiple(
        req.user.id,
        validateData.reviewId,
        Array.isArray(req.files) ? req.files : [],
        validateData.field,
    );

    res.status(201).json({
        data: response,
    });
};

export const deleteFile = async (req: IGetUserRequest, res: Response) => {
    if (!req.user || !req.user.id) {
        res.status(401).json({
            status: "error",
            message: "Authentication required",
        });

        return;
    }

    const { id } = validateIdSchema.parse(req.params);

    fileDeleteSchema.parse(req.body);

    await uploadsService.deleteFile(req.user.id, id);

    res.status(200).json({ status: "success" });
};
