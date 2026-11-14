import type { Request, Response, NextFunction } from "express";
import { createHmac, timingSafeEqual } from "node:crypto";
import { newToken } from "../utils/auth/adminSessionPolicy.js";
import { ApiError } from "../utils/apiError.js";

const signature = (value: string) => {
    const key = process.env.COOKIE_SECRET;

    if (!key || key.length < 32) {
        throw new ApiError({
            statusCode: 500,
            message: "Admin security is not configured",
        });
    }

    return createHmac("sha256", key).update(value).digest("hex");
};

export function adminSecurity(req: Request, res: Response, next: NextFunction) {
    res.setHeader("Cache-Control", "no-store");

    if (process.env.NODE_ENV === "production" && !req.secure) {
        throw new ApiError({ statusCode: 400, message: "HTTPS required" });
    }

    const origins = (process.env.ADMIN_ORIGINS ?? "")
        .split(",")
        .map((value) => value.trim());

    if (req.headers.origin && !origins.includes(req.headers.origin)) {
        throw new ApiError({ statusCode: 403, message: "Untrusted origin" });
    }

    if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
        return next();
    }

    if (!req.headers.origin || !origins.includes(req.headers.origin)) {
        throw new ApiError({ statusCode: 403, message: "Untrusted origin" });
    }

    const cookie: unknown = req.cookies?.admin_csrf;
    const header = req.get("x-csrf-token");

    if (typeof cookie !== "string" || cookie !== header) {
        throw new ApiError({ statusCode: 403, message: "Invalid CSRF token" });
    }

    const [value, mac, extra] = cookie.split(".");

    if (
        !value ||
        !/^[A-Za-z0-9_-]{43}$/.test(value) ||
        extra !== undefined ||
        !mac ||
        !/^[a-f0-9]{64}$/.test(mac) ||
        !timingSafeEqual(Buffer.from(mac), Buffer.from(signature(value)))
    ) {
        throw new ApiError({ statusCode: 403, message: "Invalid CSRF token" });
    }

    next();
}

export function csrfToken(req: Request, res: Response) {
    const value = newToken();
    const token = `${value}.${signature(value)}`;

    res.cookie("admin_csrf", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict" as const,
        path: "/api/admin",
        maxAge: 8 * 3600000,
    });

    res.json({ csrfToken: token });
}
