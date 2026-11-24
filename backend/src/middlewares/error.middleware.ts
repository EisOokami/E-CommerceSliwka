import { MulterError } from "multer";
import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/apiError.js";
import { ZodError } from "zod";

export function errorMiddleware(
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction,
) {
    if (res.headersSent) {
        next(error);

        return;
    }

    if (error instanceof MulterError) {
        res.status(error.code === "LIMIT_FILE_SIZE" ? 413 : 400).json({
            status: "error",
            message:
                error.code === "LIMIT_FILE_SIZE"
                    ? "Image exceeds the upload limit"
                    : "Invalid multipart upload",
        });

        return;
    }

    if (error instanceof ZodError) {
        res.status(400).json({
            status: "error",
            message: "Invalid data",
            details: error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            })),
        });

        return;
    }

    if (error instanceof ApiError) {
        res.status(error.statusCode).json({
            status: "error",
            message: error.message,
            ...(error.data !== undefined ? { data: error.data } : {}),
        });

        return;
    }

    if (
        typeof error === "object" &&
        error &&
        "type" in error &&
        error.type === "entity.parse.failed"
    ) {
        res.status(400).json({
            status: "error",
            message: "Invalid JSON",
        });

        return;
    }

    if (
        typeof error === "object" &&
        error &&
        "type" in error &&
        error.type === "entity.too.large"
    ) {
        res.status(413).json({
            status: "error",
            message: "Request body too large",
        });

        return;
    }

    const cause = error instanceof Error && error.cause ? error.cause : error;

    if (
        typeof cause === "object" &&
        cause &&
        "code" in cause &&
        ["23503", "23505", "23001"].includes(String(cause.code))
    ) {
        res.status(409).json({
            status: "error",
            message: "Record already exists or is referenced by other records",
        });

        return;
    }

    console.error(
        "Request failed",
        error instanceof Error ? error.name : "UnknownError",
    );

    res.status(500).json({ status: "error", message: "Internal server error" });
}
