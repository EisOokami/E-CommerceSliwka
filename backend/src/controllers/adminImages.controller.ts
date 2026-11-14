import type { Response } from "express";
import type { IAdminRequest } from "../types/types.js";
import * as adminImagesService from "../services/adminImages.service.js";
import { uuidSchema } from "../validators/validators.js";

export const listImages = async (req: IAdminRequest, res: Response) => {
    const response = await adminImagesService.listFiles();

    res.status(201).json(response);
};

export const uploadImage = async (req: IAdminRequest, res: Response) => {
    if (!req.file) {
        res.status(400).json({
            status: "error",
            message: "Image is required",
        });

        return;
    }

    const response = await adminImagesService.uploadImage(req.file, req);

    res.status(201).json(response);
};

export const deleteImage = async (req: IAdminRequest, res: Response) => {
    const validateData = uuidSchema.parse(req.params.id);

    await adminImagesService.deleteImage(validateData, req);

    res.status(201).json({ success: true });
};
