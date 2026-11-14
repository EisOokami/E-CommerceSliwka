import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
import { ApiError } from "../apiError.js";
import type { GoogleProfile } from "../../types/types.js";

dotenv.config({ quiet: true });

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
);

export function getGoogleAuthUrl(state: string): string {
    return client.generateAuthUrl({
        access_type: "online",
        scope: ["openid", "email", "profile"],
        state,
        prompt: "select_account",
    });
}

export async function exchangeCodeForProfile(
    code: string,
): Promise<GoogleProfile> {
    const { tokens } = await client.getToken(code);

    if (!tokens.id_token) {
        throw new ApiError({
            statusCode: 502,
            message: "No token returned from Google",
        });
    }

    const ticket = await client.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID as string,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.sub || !payload.email) {
        throw new ApiError({
            statusCode: 401,
            message: "Invalid Google token payload",
        });
    }

    return {
        googleId: payload.sub,
        email: payload.email,
        emailVerified: payload.email_verified ?? false,
        name: payload.given_name ?? "unknown",
        surname: payload.family_name ?? "unknown",
        avatarUrl: payload.picture ?? null,
    };
}
