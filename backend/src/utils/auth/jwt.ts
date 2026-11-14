import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { and, eq, gt, sql } from "drizzle-orm";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import crypto from "node:crypto";
import { db } from "../../db/index.js";
import { users, userSessions } from "../../db/schema.js";
import { ApiError } from "../apiError.js";

dotenv.config({ quiet: true });

const accessSecret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);
const refreshSecret = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET);

export async function createAccessToken(payload: JWTPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("15m")
        .sign(accessSecret);
}

function signRefreshToken(
    userId: string,
    id: string,
    createdAt: Date,
    expiresAt: Date,
) {
    return new SignJWT({ sub: userId, sid: id })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt(Math.floor(createdAt.getTime() / 1000))
        .setExpirationTime(Math.floor(expiresAt.getTime() / 1000))
        .sign(refreshSecret);
}

async function issueRefresh(
    userId: string,
    ip: string | undefined,
    userAgent: string | undefined,
    tx?: Parameters<Parameters<typeof db.transaction>[0]>[0],
) {
    const client = tx ? tx : db;

    const user = await client.query.users.findFirst({
        columns: {
            id: true,
        },
        where: and(
            eq(users.id, userId),
            eq(users.blocked, false),
            eq(users.confirmed, true),
        ),
    });

    if (!user) {
        throw new ApiError({
            statusCode: 401,
            message: "Invalid or expired session",
        });
    }

    const id = crypto.randomUUID();
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + 7 * 86400000);
    const token = await signRefreshToken(userId, id, createdAt, expiresAt);

    await client
        .insert(userSessions)
        .values({
            id,
            userId,
            refreshToken: await bcrypt.hash(token, 10),
            createdAt,
            expiresAt,
            ip: ip ?? null,
            userAgent: userAgent ?? null,
        })
        .returning({ id: userSessions.id });

    return { token, id };
}

export async function createRefreshToken(
    userId: string,
    ip?: string,
    userAgent?: string,
): Promise<string | null> {
    return await db.transaction(async (tx) => {
        const [user] = await tx
            .select({ id: users.id })
            .from(users)
            .where(
                and(
                    eq(users.id, userId),
                    eq(users.blocked, false),
                    eq(users.confirmed, true),
                ),
            )
            .for("update");

        if (!user) {
            throw new ApiError({
                statusCode: 401,
                message: "Invalid or expired session",
            });
        }

        return (await issueRefresh(userId, ip, userAgent, tx)).token;
    });
}

export async function verifyAccessToken(token: string) {
    return jwtVerify(token, accessSecret, { algorithms: ["HS256"] });
}

async function refreshPayload(token: string) {
    const { payload } = await jwtVerify(token, refreshSecret, {
        algorithms: ["HS256"],
    });

    if (typeof payload.sid !== "string" || typeof payload.sub !== "string") {
        throw new ApiError({
            statusCode: 401,
            message: "Invalid or expired session",
        });
    }

    return { payload, id: payload.sid, userId: payload.sub };
}

async function validateSession(
    token: string,
    userId: string,
    session: typeof userSessions.$inferSelect | undefined,
    revokeReusedChain = false,
) {
    if (
        !session ||
        session.userId !== userId ||
        !(await bcrypt.compare(token, session.refreshToken))
    ) {
        throw new ApiError({
            statusCode: 401,
            message: "Invalid or expired session",
        });
    }

    if (
        session.revoked &&
        (!session.replacedBy ||
            !session.replacedAt ||
            Date.now() - session.replacedAt.getTime() >= 10000)
    ) {
        if (revokeReusedChain && session.replacedBy) {
            await revokeSessionChain(session.id, userId);
        }

        throw new ApiError({
            statusCode: 401,
            message: "Invalid or expired session",
        });
    }

    return session;
}

export async function verifyRefreshToken(token: string) {
    const { payload, id, userId } = await refreshPayload(token);

    const userSession = await db.query.userSessions.findFirst({
        where: and(
            eq(userSessions.id, id),
            gt(userSessions.expiresAt, sql`NOW()`),
        ),
    });

    const session = await validateSession(token, userId, userSession, true);

    const user = await db.query.users.findFirst({
        columns: {
            id: true,
        },
        where: and(
            eq(users.id, userId),
            eq(users.blocked, false),
            eq(users.confirmed, true),
        ),
    });

    if (!user) {
        throw new ApiError({
            statusCode: 401,
            message: "Invalid or expired session",
        });
    }

    return { payload, session };
}

export async function rotateRefreshToken(
    token: string,
    ip?: string,
    userAgent?: string,
) {
    const { id, userId } = await refreshPayload(token);

    return await db.transaction(async (tx) => {
        const [user] = await tx
            .select({ id: users.id })
            .from(users)
            .where(
                and(
                    eq(users.id, userId),
                    eq(users.blocked, false),
                    eq(users.confirmed, true),
                ),
            )
            .for("update");

        if (!user) {
            throw new ApiError({
                statusCode: 401,
                message: "Invalid or expired session",
            });
        }

        const [userSession] = await tx
            .select()
            .from(userSessions)
            .where(
                and(
                    eq(userSessions.id, id),
                    gt(userSessions.expiresAt, sql`NOW()`),
                ),
            )
            .for("update");

        const session = await validateSession(token, user.id, userSession);

        const activeUser = await tx.query.users.findFirst({
            columns: {
                id: true,
            },
            where: and(
                eq(users.id, userId),
                eq(users.blocked, false),
                eq(users.confirmed, true),
            ),
        });

        if (!activeUser) {
            throw new ApiError({
                statusCode: 401,
                message: "Invalid or expired session",
            });
        }

        if (session.revoked && session.replacedBy) {
            const [replacement] = await tx
                .select()
                .from(userSessions)
                .where(
                    and(
                        eq(userSessions.id, session.replacedBy),
                        gt(userSessions.expiresAt, sql`NOW()`),
                    ),
                )
                .for("update");

            if (
                !replacement ||
                replacement.revoked ||
                replacement.userId !== userId
            ) {
                throw new ApiError({
                    statusCode: 401,
                    message: "Invalid or expired session",
                });
            }

            const repeated = await signRefreshToken(
                userId,
                replacement.id,
                replacement.createdAt,
                replacement.expiresAt,
            );

            if (!(await bcrypt.compare(repeated, replacement.refreshToken))) {
                throw new ApiError({
                    statusCode: 401,
                    message: "Invalid or expired session",
                });
            }

            return repeated;
        }

        const next = await issueRefresh(userId, ip, userAgent, tx);

        await tx
            .update(userSessions)
            .set({ revoked: true, replacedBy: next.id, replacedAt: new Date() })
            .where(eq(userSessions.id, id));

        return next.token;
    });
}

export const revokeSession = async (id: string) => {
    return await db
        .update(userSessions)
        .set({ revoked: true, replacedBy: null, replacedAt: null })
        .where(eq(userSessions.id, id));
};

export const revokeSessionChain = async (id: string, userId: string) => {
    return await db.execute(
        sql`with recursive chain as (select id, replaced_by from user_sessions where id = ${id} and user_id = ${userId} union select s.id, s.replaced_by from user_sessions s join chain c on s.id::text = c.replaced_by where s.user_id = ${userId}) update user_sessions set revoked = true where id in (select id from chain)`,
    );
};

export const revokeAllUserSessions = async (id: string) => {
    return await db
        .update(userSessions)
        .set({ revoked: true, replacedBy: null, replacedAt: null })
        .where(eq(userSessions.userId, id));
};
