import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { authRequest } from "@/data/main/services/authService";

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get("code");

    if (!code || !/^[a-f0-9]{64}$/.test(code)) {
        return NextResponse.redirect(
            new URL("/signIn?error=oauth_failed", request.url),
        );
    }

    try {
        const response = await authRequest("google/exchange", { code });

        if (response.requiresMfa && response.tempToken) {
            (await cookies()).set("customer_mfa", response.tempToken, {
                path: "/",
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 300,
            });

            return NextResponse.redirect(new URL("/signIn", request.url));
        }

        if (!response.accessToken) {
            return NextResponse.redirect(
                new URL("/signIn?error=oauth_failed", request.url),
            );
        }

        return NextResponse.redirect(new URL("/", request.url));
    } catch {
        return NextResponse.redirect(
            new URL("/signIn?error=oauth_failed", request.url),
        );
    }
}
