import { Router } from "express";
import rateLimit from "express-rate-limit";
import multer from "multer";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import {
    uploadSingle,
    uploadMultiple,
    deleteFile,
} from "../controllers/uploads.controller.js";
import { verifyCsrf } from "../middlewares/csrf.middleware.js";

const singleUploadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 3,
    message: {
        status: 429,
        error: "Too many requests",
        message: "Too many requests. Please try again in 15 minutes.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const multipleUploadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 3,
    message: {
        status: 429,
        error: "Too many requests",
        message: "Too many requests. Please try again in 15 minutes.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const deleteFileLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 3,
    message: {
        status: 429,
        error: "Too many requests",
        message: "Too many requests. Please try again in 15 minutes.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const router = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: Math.min(
            20 * 1024 * 1024,
            Math.max(
                1024,
                Number(process.env.MAX_IMAGE_BYTES) || 5 * 1024 * 1024,
            ),
        ),
        files: 10,
        fields: 2,
        parts: 12,
    },
});

router.post(
    "/",
    singleUploadLimiter,
    authenticateToken,
    verifyCsrf,
    upload.single("file"),
    uploadSingle,
);
router.post(
    "/multiple",
    multipleUploadLimiter,
    authenticateToken,
    verifyCsrf,
    upload.array("files"),
    uploadMultiple,
);
router.delete(
    "/:id",
    deleteFileLimiter,
    authenticateToken,
    verifyCsrf,
    deleteFile,
);

export default router;
