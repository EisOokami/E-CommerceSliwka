import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { forwardedClientIp, storeOrigin } from "./data/main/services/http";
import { refreshAccessToken } from "./data/main/services/refreshAccessToken";

const accessTokenConfig = {
    maxAge: 15 * 60,
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
};
const refreshTokenConfig = {
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
};
const csrfTokenConfig = {
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
};

const protectedRoutes = ["/cart", "/profile", "/account", "/wishlist"];
const protectedAuthRoutes = ["/signIn", "/signUp"];

function isProtectedRoute(path: string): boolean {
    return protectedRoutes.some((route) => path.startsWith(route));
}

function isProtectedAuthRoute(path: string): boolean {
    return protectedAuthRoutes.some((route) => path.startsWith(route));
}

export async function middleware(request: NextRequest) {
    const currentPath = request.nextUrl.pathname;

    let accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;
    const csrfToken = request.cookies.get("csrfToken")?.value;

    let tokens = null;
    let invalidSession = false;

    if (!currentPath.startsWith("/admin") && accessToken) {
        try {
            const session = await fetch(
                new URL("/api/users/me", storeOrigin()),
                {
                    headers: {
                        Authorization: "Bearer " + accessToken,
                        ...forwardedClientIp(request.headers),
                    },
                    cache: "no-store",
                },
            );

            if (session.status === 401) {
                accessToken = undefined;
                invalidSession = true;
            }

            if (!session.ok) {
                return new NextResponse(
                    "Account service unavailable. Please retry.",
                    { status: 503 },
                );
            }
        } catch {
            return new NextResponse(
                "Account service unavailable. Please retry.",
                { status: 503 },
            );
        }
    }

    if (
        !currentPath.startsWith("/admin") &&
        !accessToken &&
        refreshToken &&
        csrfToken
    ) {
        try {
            tokens = await refreshAccessToken(
                refreshToken,
                csrfToken,
                request.headers,
            );
            invalidSession = !tokens;
        } catch {
            return new NextResponse(
                "Account service unavailable. Please retry.",
                { status: 503 },
            );
        }

        if (tokens) {
            accessToken = tokens.accessToken;
        }
    }

    if (
        !currentPath.startsWith("/admin") &&
        isProtectedRoute(currentPath) &&
        !accessToken
    ) {
        const response = NextResponse.redirect(new URL("/signIn", request.url));

        if (invalidSession) {
            ["accessToken", "refreshToken", "csrfToken"].forEach((name) => {
                response.cookies.delete(name);
            });
        }

        return response;
    }

    const redirectSignedInCustomer =
        !currentPath.startsWith("/admin") &&
        isProtectedAuthRoute(currentPath) &&
        !!accessToken;

    const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
    const cspHeader = `
            default-src 'self';
            script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${process.env.NODE_ENV === "development" ? "'unsafe-eval'" : ""};
            style-src 'self' 'nonce-${nonce}';
            style-src-attr 'self' 'unsafe-inline';
            img-src 'self' data: blob:;
            connect-src 'self';
            font-src 'self';
            object-src 'none';
            base-uri 'self';
            form-action 'self';
            frame-ancestors 'none';
            ${process.env.NODE_ENV === "production" ? "upgrade-insecure-requests;" : ""}
        `
        .replace(/\s{2,}/g, " ")
        .trim();

    const contentSecurityPolicyHeaderValue = cspHeader
        .replace(/\s{2,}/g, " ")
        .trim();

    const requestHeaders = new Headers(request.headers);

    if (tokens) {
        request.cookies.set("accessToken", tokens.accessToken);
        request.cookies.set("refreshToken", tokens.refreshToken);
        request.cookies.set("csrfToken", tokens.csrfToken);

        requestHeaders.set("cookie", request.cookies.toString());
    }

    if (invalidSession && !tokens) {
        ["accessToken", "refreshToken", "csrfToken"].forEach((name) => {
            request.cookies.delete(name);
        });

        requestHeaders.set("cookie", request.cookies.toString());
    }

    requestHeaders.set("x-nonce", nonce);

    requestHeaders.set(
        "Content-Security-Policy",
        contentSecurityPolicyHeaderValue,
    );

    const response = redirectSignedInCustomer
        ? NextResponse.redirect(new URL("/", request.url))
        : NextResponse.next({
              request: {
                  headers: requestHeaders,
              },
          });

    if (!currentPath.startsWith("/admin") && tokens) {
        response.cookies.set(
            "accessToken",
            tokens.accessToken,
            accessTokenConfig,
        );
        response.cookies.set(
            "refreshToken",
            tokens.refreshToken,
            refreshTokenConfig,
        );
        response.cookies.set("csrfToken", tokens.csrfToken, csrfTokenConfig);
    }

    if (invalidSession && !tokens) {
        ["accessToken", "refreshToken", "csrfToken"].forEach((name) => {
            response.cookies.delete(name);
        });
    }

    response.headers.set(
        "Content-Security-Policy",
        contentSecurityPolicyHeaderValue,
    );
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set(
        "Strict-Transport-Security",
        "max-age=31536000; includeSubDomains; preload",
    );
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set(
        "Permissions-Policy",
        "camera=(), microphone=(), geolocation=(), browsing-topics=()",
    );

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        {
            source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
            missing: [
                { type: "header", key: "next-router-prefetch" },
                { type: "header", key: "purpose", value: "prefetch" },
            ],
        },
    ],
};
