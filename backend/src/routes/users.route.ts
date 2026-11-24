import { Router } from "express";
import rateLimit from "express-rate-limit";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import {
    acceptTerms,
    deleteAccount,
    exportData,
    me,
    changePassword,
    requestAccountDeletionCode,
    updateUser,
    setPassword,
} from "../controllers/users.controller.js";
import { validateData } from "../middlewares/validation.middleware.js";
import { verifyCsrf } from "../middlewares/csrf.middleware.js";
import {
    acceptTermsSchema,
    changePasswordSchema,
    setPasswordSchema,
    userUpdateSchema,
} from "../validators/users.js";

const acceptTermsLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 10,
    message: {
        status: 429,
        error: "Too many requests",
        message: "Too many requests. Please try again in 1 hour.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const updateUserLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    limit: 3,
    message: {
        status: 429,
        error: "Too many requests",
        message: "Too many requests. Please try again in 30 minutes.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const changePasswordLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    limit: 3,
    message: {
        status: 429,
        error: "Too many requests",
        message: "Too many requests. Please try again in 30 minutes.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const deleteLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 10,
    message: {
        status: 429,
        error: "Too many requests",
        message: "Too many requests. Please try again in 60 minutes.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const deletionCodeLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    limit: 3,
    message: {
        status: 429,
        error: "Too many requests",
        message: "Too many requests. Please try again in 30 minutes.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const exportLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    message: {
        status: 429,
        error: "Too many requests",
        message: "Too many requests. Please try again in 60 minutes.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const setPasswordLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 300,
    message: {
        status: 429,
        error: "Too many requests",
        message: "Too many requests. Please try again in 60 minutes.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const router = Router();

router.get("/me", authenticateToken, me);
router.post(
    "/me/accept-terms",
    acceptTermsLimiter,
    authenticateToken,
    verifyCsrf,
    validateData(acceptTermsSchema),
    acceptTerms,
);
router.get("/me/export", exportLimiter, authenticateToken, exportData);
router.post(
    "/me/deletion-code",
    deletionCodeLimiter,
    authenticateToken,
    verifyCsrf,
    requestAccountDeletionCode,
);
router.put(
    "/",
    updateUserLimiter,
    authenticateToken,
    verifyCsrf,
    validateData(userUpdateSchema),
    updateUser,
);
router.post(
    "/change-password",
    changePasswordLimiter,
    authenticateToken,
    verifyCsrf,
    validateData(changePasswordSchema),
    changePassword,
);
router.delete(
    "/:id",
    deleteLimiter,
    authenticateToken,
    verifyCsrf,
    deleteAccount,
);
router.post(
    "/set-password",
    setPasswordLimiter,
    authenticateToken,
    verifyCsrf,
    validateData(setPasswordSchema),
    setPassword,
);

export default router;
