import { Router } from "express";
import multer from "multer";
import rateLimit from "express-rate-limit";
import { requirePermission } from "../middlewares/permission.middleware.js";
import { requireStepUp } from "../middlewares/adminStepUp.middleware.js";
import * as adminImagesService from "../services/adminImages.service.js";
import { authenticateAdminSession } from "../middlewares/adminAuth.middleware.js";
import {
    deleteImage,
    listImages,
    uploadImage,
} from "../controllers/adminImages.controller.js";

const router = Router();

const uploadImageLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    message: {
        status: 429,
        error: "Too many requests",
        message: "Too many requests. Please try again in 15 minutes.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const deleteImageLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    message: {
        status: 429,
        error: "Too many requests",
        message: "Too many requests. Please try again in 15 minutes.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

router.get(
    "/product-categories",
    authenticateAdminSession,
    requirePermission("products.read", "products.create", "products.update"),
    async (req, res) => {
        res.json(await adminImagesService.productCategories());
    },
);
router.get(
    "/images",
    authenticateAdminSession,
    requirePermission("products.read"),
    listImages,
);
router.post(
    "/images",
    uploadImageLimiter,
    authenticateAdminSession,
    requirePermission("products.create", "products.update"),
    multer({
        storage: multer.memoryStorage(),
        limits: {
            fileSize: Math.min(
                20 * 1024 * 1024,
                Math.max(
                    1024,
                    Number(process.env.MAX_IMAGE_BYTES) || 5 * 1024 * 1024,
                ),
            ),
            files: 1,
            fields: 0,
            parts: 2,
        },
    }).single("image"),
    uploadImage,
);
router.delete(
    "/images/:id",
    deleteImageLimiter,
    authenticateAdminSession,
    requirePermission("products.delete"),
    requireStepUp,
    deleteImage,
);

export default router;
