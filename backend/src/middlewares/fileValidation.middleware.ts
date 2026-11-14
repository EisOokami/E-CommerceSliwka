import { fileTypeFromBuffer } from "file-type";
import { promises } from "fs";
import type { IGetUserRequest } from "../types/types.js";
import type { NextFunction, Response } from "express";

export const fileValidation = async (
    req: IGetUserRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        if (!req.file) {
            res.status(400).json({
                status: "error",
                message: "File is required",
            });

            return;
        }

        const filePath = req.file.path;
        const buffer = await promises.readFile(filePath);
        const type = await fileTypeFromBuffer(buffer);

        if (!type || type.mime !== req.file.mimetype) {
            await promises.unlink(filePath);

            res.status(415).json({
                status: "error",
                message: "Invalid file type",
            });

            return;
        }

        next();
    } catch {
        res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};

export const filesValidation = async (
    req: IGetUserRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        if (!req.files) {
            res.status(400).json({
                status: "error",
                message: "Files are required",
            });

            return;
        }

        const files = Array.isArray(req.files)
            ? req.files
            : Object.values(req.files).flat();

        for (const file of files) {
            const buffer = await promises.readFile(file.path);
            const type = await fileTypeFromBuffer(buffer);

            if (!type || type.mime !== file.mimetype) {
                await Promise.all(
                    files.map(async (file) => {
                        try {
                            await promises.unlink(file.path);
                        } catch (error) {
                            console.error(
                                `Failed to delete file "${file.path}":`,
                                error,
                            );
                        }
                    }),
                );

                res.status(415).json({
                    status: "error",
                    message: `Invalid file type: ${file.originalname}`,
                });

                return;
            }
        }

        next();
    } catch {
        res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};
