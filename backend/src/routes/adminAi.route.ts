import { Router } from "express";
import rateLimit from "express-rate-limit";
import { authenticateAdminSession } from "../middlewares/adminAuth.middleware.js";
import { requirePermission } from "../middlewares/permission.middleware.js";
import {
    autofillProduct,
    generateDescription,
} from "../controllers/adminAi.controller.js";

const autofillProductLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: {
        status: 429,
        error: "Too many requests",
        message: "Too many requests. Please try again in 15 minutes.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const generateDescriptionLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: {
        status: 429,
        error: "Too many requests",
        message: "Too many requests. Please try again in 15 minutes.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const router = Router();

router.post(
    "/autofill-product",
    autofillProductLimiter,
    authenticateAdminSession,
    requirePermission("products.create", "products.update"),
    autofillProduct,
);

router.post(
    "/generate-description",
    generateDescriptionLimiter,
    authenticateAdminSession,
    requirePermission("products.create", "products.update"),
    generateDescription,
);

export default router;
