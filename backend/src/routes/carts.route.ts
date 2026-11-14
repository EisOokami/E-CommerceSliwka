import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { validateData } from "../middlewares/validation.middleware.js";
import { verifyCsrf } from "../middlewares/csrf.middleware.js";
import {
    createCart,
    deleteCart,
    getCart,
    getCarts,
    updateCart,
} from "../controllers/carts.controller.js";
import { cartInsertSchema, cartUpdateSchema } from "../validators/carts.js";
import rateLimit from "express-rate-limit";

const createCartLimiter = rateLimit({
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

const updateCartLimiter = rateLimit({
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

const deleteCartLimiter = rateLimit({
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

router.get("/", authenticateToken, getCarts);
router.get("/:id", authenticateToken, getCart);
router.post(
    "/",
    createCartLimiter,
    authenticateToken,
    verifyCsrf,
    validateData(cartInsertSchema),
    createCart,
);
router.put(
    "/:id",
    updateCartLimiter,
    authenticateToken,
    verifyCsrf,
    validateData(cartUpdateSchema),
    updateCart,
);
router.delete(
    "/:id",
    deleteCartLimiter,
    authenticateToken,
    verifyCsrf,
    deleteCart,
);

export default router;
