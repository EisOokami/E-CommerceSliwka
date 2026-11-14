import { and, eq, gt } from "drizzle-orm";
import { db } from "../db/index.js";
import { adminMfaLoginSessions } from "../db/schema.js";
import { type DatabaseClient } from "../types/database.js";
import { hashToken, newToken } from "../utils/auth/adminSessionPolicy.js";

export const create = async (data: {
    adminId: string;
    authVersion: number;
    ip: string | undefined;
    userAgent: string | undefined;
}) => {
    const rawToken = newToken();

    await db.insert(adminMfaLoginSessions).values({
        ...data,
        tokenHash: hashToken(rawToken),
        expiresAt: new Date(Date.now() + 300000),
    });

    return { rawToken };
};

export const consumeByRawToken = async (rawToken: string) => {
    return (
        await db
            .delete(adminMfaLoginSessions)
            .where(
                and(
                    eq(adminMfaLoginSessions.tokenHash, hashToken(rawToken)),
                    gt(adminMfaLoginSessions.expiresAt, new Date()),
                ),
            )
            .returning()
    )[0];
};

export const invalidateChallenges = async (
    client: DatabaseClient,
    adminId: string,
) => {
    return await client
        .delete(adminMfaLoginSessions)
        .where(eq(adminMfaLoginSessions.adminId, adminId));
};
