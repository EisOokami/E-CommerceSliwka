import type { Request, Response, NextFunction } from "express";
import {
    forgotPasswordSchema,
    loginSchema,
    registerSchema,
    resendVerificationSchema,
    resetPasswordSchema,
    verifyMfaSchema,
} from "../validators/auth.js";
import { ZodError } from "zod";
import * as authService from "../services/auth.service.js";
import { sendLoginNotificationEmail } from "../utils/email/loginNotificationEmail.js";
import { getGoogleAuthUrl } from "../utils/auth/googleAuth.js";
import dotenv from "dotenv";
import crypto from "crypto";
import * as customerMfaService from "../services/customerMfa.service.js";

dotenv.config({ quiet: true });

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const validateData = registerSchema.parse(req.body);

        const { username, email, password } = validateData;

        await authService.register(username, email, password);

        res.status(201).json({
            status: "success",
            message:
                "User has been successfully registered. Please check your email to verify your account.",
        });
    } catch (error) {
        if (error instanceof ZodError) {
            const errorMessages = error.issues.map((issue) => ({
                field: issue.path[0],
                message: issue.message,
            }));

            res.status(400).json({
                status: "error",
                message: "Invalid data",
                details: errorMessages,
            });

            return;
        }

        next(error);
    }
};

export const verifyEmail = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const token = req.query.token;

        if (!token || typeof token !== "string") {
            res.status(400).json({
                status: "error",
                message: "Verification token is required",
            });

            return;
        }

        const response = await authService.verifyEmail(token);

        if (response && "status" in response && response.status === "success") {
            res.status(200).json({
                status: "success",
                message: response.message,
            });

            return;
        }

        res.status(200).json({
            status: "success",
            message: "Email successfully verified. You can now log in.",
        });
    } catch (error) {
        if (error instanceof ZodError) {
            const errorMessages = error.issues.map((issue) => ({
                field: issue.path[0],
                message: issue.message,
            }));

            res.status(400).json({
                status: "error",
                message: "Invalid data",
                details: errorMessages,
            });

            return;
        }

        next(error);
    }
};

export const resendVerificationEmail = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { email } = resendVerificationSchema.parse(req.body);

        const response = await authService.resendVerificationEmail(email);

        if (response && "status" in response && response.status === "success") {
            res.status(200).json({
                status: "success",
                message: response.message,
            });

            return;
        }

        res.status(200).json({
            status: "success",
            message:
                "If this email is registered and not verified, a new verification link has been sent.",
        });
    } catch (error) {
        if (error instanceof ZodError) {
            const errorMessages = error.issues.map((issue) => ({
                field: issue.path[0],
                message: issue.message,
            }));

            res.status(400).json({
                status: "error",
                message: "Invalid data",
                details: errorMessages,
            });

            return;
        }

        next(error);
    }
};

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const validateData = loginSchema.parse(req.body);

        const { email, password } = validateData;

        const response = await authService.login(
            email,
            password,
            req.ip,
            req.headers["user-agent"],
        );

        if (
            response &&
            "status" in response &&
            response.status === "success" &&
            "requiresMfa" in response &&
            "tempToken" in response
        ) {
            res.status(200).json({
                status: "success",
                message: response.message,
                requiresMfa: response.requiresMfa,
                tempToken: response.tempToken,
            });

            return;
        }

        if (
            response &&
            "status" in response &&
            response.status === "success" &&
            "csrfToken" in response &&
            "accessToken" in response &&
            "refreshToken" in response &&
            "user" in response
        ) {
            res.cookie("csrfToken", response.csrfToken, {
                httpOnly: false,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.status(200).json({
                status: "success",
                message: "User logged in successfully",
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
            });

            sendLoginNotificationEmail(response.user, req).catch((error) => {
                console.error(
                    "Login notification email failed",
                    error instanceof Error ? error.name : "UnknownError",
                );
            });
        }
    } catch (error) {
        if (error instanceof ZodError) {
            const errorMessages = error.issues.map((issue) => ({
                field: issue.path[0],
                message: issue.message,
            }));

            res.status(400).json({
                status: "error",
                message: "Invalid data",
                details: errorMessages,
            });

            return;
        }

        next(error);
    }
};

export const forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const validateData = forgotPasswordSchema.parse(req.body);

        const { email } = validateData;

        const response = await authService.forgotPassword(email);

        if (response && "status" in response && response.status === "success") {
            res.status(200).json({
                status: "success",
                message: response.message,
            });

            return;
        }
    } catch (error) {
        if (error instanceof ZodError) {
            const errorMessages = error.issues.map((issue) => ({
                field: issue.path[0],
                message: issue.message,
            }));

            res.status(400).json({
                status: "error",
                message: "Invalid data",
                details: errorMessages,
            });

            return;
        }

        next(error);
    }
};

export const resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const validateData = resetPasswordSchema.parse(req.body);

        const { token, password, id } = validateData;

        const response = await authService.resetPassword(
            token,
            password,
            id,
            req.ip,
            req.headers["user-agent"],
        );

        res.status(200).json(response);
    } catch (error) {
        if (error instanceof ZodError) {
            const errorMessages = error.issues.map((issue) => ({
                field: issue.path[0],
                message: issue.message,
            }));

            res.status(400).json({
                status: "error",
                message: "Invalid data",
                details: errorMessages,
            });

            return;
        }

        next(error);
    }
};

export const refresh = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            res.status(401).json({
                status: "error",
                message: "Invalid token",
            });

            return;
        }

        const response = await authService.refresh(
            refreshToken,
            req.ip,
            req.headers["user-agent"],
        );

        res.cookie("csrfToken", response.csrfToken, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            status: "success",
            message: response.message,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
        });
    } catch (error) {
        if (error instanceof ZodError) {
            const errorMessages = error.issues.map((issue) => ({
                field: issue.path[0],
                message: issue.message,
            }));

            res.status(400).json({
                status: "error",
                message: "Invalid data",
                details: errorMessages,
            });

            return;
        }

        next(error);
    }
};

export const logout = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            res.status(401).json({
                status: "error",
                message: "Invalid token",
            });

            return;
        }

        await authService.logout(refreshToken);

        res.clearCookie("refreshToken");
        res.clearCookie("csrfToken");

        res.status(201).json({
            status: "success",
            message: "Logout successfully",
        });
    } catch (error) {
        if (error instanceof ZodError) {
            const errorMessages = error.issues.map((issue) => ({
                field: issue.path[0],
                message: issue.message,
            }));

            res.status(400).json({
                status: "error",
                message: "Invalid data",
                details: errorMessages,
            });

            return;
        }

        next(error);
    }
};

export const googleAuthStart = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const state = crypto.randomUUID();

        res.cookie("google_oauth_state", state, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 5 * 60 * 1000,
        });

        const url = getGoogleAuthUrl(state);

        res.redirect(url);
    } catch (error) {
        next(error);
    }
};

export const googleAuthCallback = async (req: Request, res: Response) => {
    try {
        const { code, state } = req.query;
        const savedState = req.cookies?.google_oauth_state;

        res.clearCookie("google_oauth_state");

        if (
            !code ||
            typeof code !== "string" ||
            !state ||
            state !== savedState
        ) {
            res.redirect(
                `${process.env.FRONTEND_URL}/signIn?error=oauth_state_mismatch`,
            );

            return;
        }

        const response = await authService.googleAuthCallback(code);

        res.redirect(response.redirect);
    } catch (error) {
        console.error(
            "Authentication request failed",
            error instanceof Error ? error.name : "UnknownError",
        );

        return res.redirect(
            `${process.env.FRONTEND_URL}/signIn?error=oauth_failed`,
        );
    }
};

export const googleAuthExchange = async (req: Request, res: Response) => {
    try {
        const { code } = req.body;

        if (!code || typeof code !== "string") {
            res.status(400).json({ status: "error", message: "Missing code" });

            return;
        }

        const response = await authService.googleAuthExchange(
            code,
            req.ip,
            req.headers["user-agent"],
        );

        if ("requiresMfa" in response) {
            res.status(200).json(response);

            return;
        }

        res.cookie("csrfToken", response.csrfToken, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            status: "success",
            message: response.message,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
        });
    } catch (error) {
        console.error(
            "Authentication request failed",
            error instanceof Error ? error.name : "UnknownError",
        );

        return res.redirect(
            `${process.env.FRONTEND_URL}/signIn?error=oauth_failed`,
        );
    }
};

export const verifyMfa = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { tempToken, code } = verifyMfaSchema.parse(req.body);

        const result = await customerMfaService.verifyCustomerMfa(
            tempToken,
            code,
            req.ip,
            req.headers["user-agent"],
        );

        res.cookie("csrfToken", result.csrfToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 7 * 86400000,
        });

        res.status(200).json({
            status: "success",
            message: "User logged in successfully",
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        });
    } catch (error) {
        if (error instanceof ZodError) {
            const errorMessages = error.issues.map((issue) => ({
                field: issue.path[0],
                message: issue.message,
            }));

            res.status(400).json({
                status: "error",
                message: "Invalid data",
                details: errorMessages,
            });

            return;
        }

        next(error);
    }
};
