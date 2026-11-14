import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { validateData } from "../middlewares/validation.middleware.js";
import { verifyCsrf } from "../middlewares/csrf.middleware.js";
import {
    createWishlist,
    getWishlists,
    deleteWishlist,
    getWishlistsCount,
} from "../controllers/wishlists.controller.js";
import { wishlistInsertSchema } from "../validators/wishlists.js";
import rateLimit from "express-rate-limit";

const createWishlistLimiter = rateLimit({
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

const deleteWishlistLimiter = rateLimit({
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

router.get("/", authenticateToken, getWishlists);
router.post(
    "/",
    createWishlistLimiter,
    authenticateToken,
    verifyCsrf,
    validateData(wishlistInsertSchema),
    createWishlist,
);
router.delete(
    "/:id",
    deleteWishlistLimiter,
    authenticateToken,
    verifyCsrf,
    deleteWishlist,
);
router.get("/", authenticateToken, getWishlistsCount);

export default router;
