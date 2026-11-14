import { and, eq, gt } from "drizzle-orm";
import { db } from "../db/index.js";
import { mfaLoginSessions, users } from "../db/schema.js";
import { ApiError } from "../utils/apiError.js";
import { createAccessToken, createRefreshToken } from "../utils/auth/jwt.js";
import { hashToken } from "../utils/auth/mfa.js";
import { generateCsrfToken } from "../utils/csrf.js";
import * as totpService from "./totp.service.js";

export const verifyCustomerMfa = async (
    tempToken: string,
    code: string,
    ip?: string,
    userAgent?: string,
) => {
    const [challenge] = await db
        .delete(mfaLoginSessions)
        .where(
            and(
                eq(mfaLoginSessions.tokenHash, hashToken(tempToken)),
                gt(mfaLoginSessions.expiresAt, new Date()),
            ),
        )
        .returning();

    const user = challenge
        ? await db.query.users.findFirst({
              where: eq(users.id, challenge.userId),
          })
        : undefined;

    if (
        !user ||
        user.blocked ||
        !user.confirmed ||
        !user.mfaEnabled ||
        !user.mfaSecret ||
        !(await totpService.verifyCode(user.mfaSecret, code))
    ) {
        throw new ApiError({
            statusCode: 401,
            message: "Invalid or expired MFA challenge. Sign in again.",
        });
    }

    return {
        accessToken: await createAccessToken({ id: user.id }),
        refreshToken: await createRefreshToken(user.id, ip, userAgent),
        csrfToken: generateCsrfToken(),
    };
};
