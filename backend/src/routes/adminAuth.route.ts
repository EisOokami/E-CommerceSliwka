import { Router } from "express";
import { adminCredentialLimit } from "../middlewares/adminRateLimit.middleware.js";
import { authenticateAdminSession } from "../middlewares/adminAuth.middleware.js";
import { requireStepUp } from "../middlewares/adminStepUp.middleware.js";
import { csrfToken } from "../middlewares/adminSecurity.middleware.js";
import {
    adminLogin,
    logout,
    me,
    verifyMfa,
    logoutAll,
    listSessions,
    revokeSession,
    securityEvents,
    setupMfa,
    confirmMfa,
    disableMfa,
    changePassword,
} from "../controllers/adminAuth.controller.js";
import { validateData } from "../middlewares/validation.middleware.js";
import {
    loginSchema,
    passwordSchema,
    verifyMfaSchema,
} from "../validators/adminAuth.js";
import rateLimit from "express-rate-limit";

const adminLoginLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    message: {
        status: 429,
        error: "Too many requests",
        message: "Too many requests. Please try again in 1 hour.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const verifyMfaLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    message: {
        status: 429,
        error: "Too many requests",
        message: "Too many requests. Please try again in 1 hour.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const logoutLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    message: {
        status: 429,
        error: "Too many requests",
        message: "Too many requests. Please try again in 1 hour.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const logoutAllLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    message: {
        status: 429,
        error: "Too many requests",
        message: "Too many requests. Please try again in 1 hour.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const revokeSessionLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    message: {
        status: 429,
        error: "Too many requests",
        message: "Too many requests. Please try again in 1 hour.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const setupMfaLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    message: {
        status: 429,
        error: "Too many requests",
        message: "Too many requests. Please try again in 1 hour.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const confirmMfaLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    message: {
        status: 429,
        error: "Too many requests",
        message: "Too many requests. Please try again in 1 hour.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const disableMfaLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    message: {
        status: 429,
        error: "Too many requests",
        message: "Too many requests. Please try again in 1 hour.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const changePasswordLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    message: {
        status: 429,
        error: "Too many requests",
        message: "Too many requests. Please try again in 1 hour.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const router = Router();

router.get("/csrf", csrfToken);
router.post(
    "/login",
    adminLoginLimiter,
    adminCredentialLimit(5, 60 * 60000),
    validateData(loginSchema),
    adminLogin,
);
router.post(
    "/verify-mfa",
    verifyMfaLimiter,
    adminCredentialLimit(5, 60 * 60000),
    validateData(verifyMfaSchema),
    verifyMfa,
);
router.get("/me", authenticateAdminSession, me);
router.post("/logout", logoutLimiter, authenticateAdminSession, logout);
router.post(
    "/logout-all",
    logoutAllLimiter,
    authenticateAdminSession,
    logoutAll,
);
router.get("/sessions", authenticateAdminSession, listSessions);
router.delete(
    "/sessions/:sessionId",
    revokeSessionLimiter,
    authenticateAdminSession,
    revokeSession,
);
router.get("/security-events", authenticateAdminSession, securityEvents);
router.post(
    "/mfa/setup",
    setupMfaLimiter,
    authenticateAdminSession,
    requireStepUp,
    setupMfa,
);
router.post(
    "/mfa/confirm",
    confirmMfaLimiter,
    authenticateAdminSession,
    requireStepUp,
    validateData(verifyMfaSchema),
    confirmMfa,
);
router.post(
    "/mfa/disable",
    disableMfaLimiter,
    authenticateAdminSession,
    requireStepUp,
    disableMfa,
);
router.post(
    "/password",
    changePasswordLimiter,
    authenticateAdminSession,
    requireStepUp,
    validateData(passwordSchema),
    changePassword,
);

export default router;
