import type { Request, Response, NextFunction } from "express";
import { generateCsrfToken, verifyCsrfToken } from "../utils/csrf.js";

const CSRF_COOKIE_NAME = "csrfToken";

export function issueCsrfCookie(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    if (!req.cookies[CSRF_COOKIE_NAME]) {
        const token = generateCsrfToken();

        res.cookie(CSRF_COOKIE_NAME, token, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });
    }

    next();
}

export function verifyCsrf(req: Request, res: Response, next: NextFunction) {
    const safeMethods = ["GET", "HEAD", "OPTIONS"];

    if (safeMethods.includes(req.method)) {
        return next();
    }

    const cookieToken = req.cookies[CSRF_COOKIE_NAME];
    const headerToken = req.headers["x-csrf-token"];

    if (
        !cookieToken ||
        !headerToken ||
        cookieToken !== headerToken ||
        !verifyCsrfToken(cookieToken)
    ) {
        res.status(403).json({
            status: "error",
            message: "CSRF_TOKEN_INVALID",
        });

        return;
    }

    next();
}
