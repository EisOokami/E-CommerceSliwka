import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { validateData } from "../middlewares/validation.middleware.js";
import { verifyCsrf } from "../middlewares/csrf.middleware.js";
import {
    getOrders,
    history,
    createOrder,
    confirm,
} from "../controllers/orders.controller.js";
import rateLimit from "express-rate-limit";
import { orderConfirmSchema, orderInsertSchema } from "../validators/orders.js";

const createOrderLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 5,
    message: {
        status: 429,
        error: "Too many requests",
        message: "Too many requests. Please try again in 5 minutes.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const confirmLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 5,
    message: {
        status: 429,
        error: "Too many requests",
        message: "Too many requests. Please try again in 5 minutes.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const router = Router();

router.get("/history", authenticateToken, history);
router.get("/", authenticateToken, getOrders);
router.post(
    "/",
    createOrderLimiter,
    authenticateToken,
    verifyCsrf,
    validateData(orderInsertSchema),
    createOrder,
);
router.post(
    "/confirm",
    confirmLimiter,
    authenticateToken,
    verifyCsrf,
    validateData(orderConfirmSchema),
    confirm,
);

export default router;
