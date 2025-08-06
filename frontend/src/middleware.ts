import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUserMeLoader } from "./data/services/getUserMeLoader";

const protectedRoutes = ["/cart", "/profile", "/wishlist"];
const protectedAuthRoutes = ["/signIn", "/signUp"];

function isProtectedRoute(path: string): boolean {
    return protectedRoutes.some((route) => path.startsWith(route));
}

function isProtectedAuthRoute(path: string): boolean {
    return protectedAuthRoutes.some((route) => path.startsWith(route));
}

export async function middleware(request: NextRequest) {
    const user = await getUserMeLoader();
    const currentPath = request.nextUrl.pathname;

    if (isProtectedRoute(currentPath) && !user.ok) {
        return NextResponse.redirect(new URL("/signIn", request.url));
    }

    if (isProtectedAuthRoute(currentPath) && user.ok) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
    const cspHeader = `
            default-src 'self';
            script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
            style-src 'self' 'nonce-${nonce}';
            style-src-attr 'self' 'unsafe-inline';
            img-src 'self' http://127.0.0.1:1337 blob:;
            connect-src 'self' http://127.0.0.1:1337;
            font-src 'self';
            object-src 'none';
            base-uri 'self';
            form-action 'self';
            frame-ancestors 'none';
            upgrade-insecure-requests;
        `
        .replace(/\s{2,}/g, " ")
        .trim();

    const contentSecurityPolicyHeaderValue = cspHeader
        .replace(/\s{2,}/g, " ")
        .trim();

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-nonce", nonce);

    requestHeaders.set(
        "Content-Security-Policy",
        contentSecurityPolicyHeaderValue,
    );

    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
    response.headers.set(
        "Content-Security-Policy",
        contentSecurityPolicyHeaderValue,
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
