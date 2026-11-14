import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
    forgotPassword,
    googleAuthCallback,
    googleAuthExchange,
    googleAuthStart,
    login,
    logout,
    refresh,
    register,
    resendVerificationEmail,
    resetPassword,
    verifyEmail,
    verifyMfa,
} from "../controllers/auth.controller.js";
import { validateData } from "../middlewares/validation.middleware.js";
import { verifyCsrf } from "../middlewares/csrf.middleware.js";
import {
    forgotPasswordSchema,
    loginSchema,
    registerSchema,
    resendVerificationSchema,
    resetPasswordSchema,
} from "../validators/auth.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const registerLimiter = rateLimit({
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

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    message: {
        status: 429,
        error: "Too many requests",
        message: "Too many requests. Please try again in 15 minutes.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const forgotPasswordLimiter = rateLimit({
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

const resetPasswordLimiter = rateLimit({
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

const googleAuthExchangeLimiter = rateLimit({
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

const verifyEmailLimiter = rateLimit({
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

const resendVerificationLimiter = rateLimit({
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

const router = Router();

router.post(
    "/register",
    registerLimiter,
    validateData(registerSchema),
    register,
);
router.get("/verify-email", verifyEmailLimiter, verifyEmail);
router.post(
    "/resend-verification",
    resendVerificationLimiter,
    validateData(resendVerificationSchema),
    resendVerificationEmail,
);
router.post("/login", loginLimiter, validateData(loginSchema), login);
router.post("/mfa/verify", verifyMfaLimiter, verifyMfa);
router.post(
    "/forgot-password",
    forgotPasswordLimiter,
    validateData(forgotPasswordSchema),
    forgotPassword,
);
router.post(
    "/reset-password",
    resetPasswordLimiter,
    validateData(resetPasswordSchema),
    resetPassword,
);
router.post("/refresh", verifyCsrf, refresh);
router.post("/logout", authenticateToken, verifyCsrf, logout);
router.get("/google", googleAuthStart);
router.get("/google/callback", googleAuthCallback);
router.post("/google/exchange", googleAuthExchangeLimiter, googleAuthExchange);

export default router;
