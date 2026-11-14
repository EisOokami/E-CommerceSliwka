import { and, eq, gt, isNull, ne, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { adminPermissions, adminSessions } from "../db/schema.js";
import { type DatabaseClient } from "../types/database.js";
import { ApiError } from "../utils/apiError.js";
import {
    expressAtMs,
    hashToken,
    lastActivityAtMs,
    newToken,
} from "../utils/auth/adminSessionPolicy.js";
import { findAdmin, lockAdmin, updateAdmin } from "./adminAuth.service.js";
import { invalidateChallenges } from "./adminMfaLoginSession.service.js";
import { insertAudit } from "./audit.service.js";

export const createSession = async (data: {
    adminId: string;
    ip: string | undefined;
    userAgent: string | undefined;
}) => {
    const rawToken = newToken();
    const session = await insertAdminSession(db, {
        ...data,
        tokenHash: hashToken(rawToken),
        expiresAt: new Date(Date.now() + expressAtMs),
    });

    return { rawToken, session };
};

export const validateAndTouch = async (rawToken: string) => {
    if (!/^[A-Za-z0-9_-]{43}$/.test(rawToken)) {
        return { valid: false as const };
    }

    const now = new Date();
    const [session] = await db
        .update(adminSessions)
        .set({ lastActivityAt: now })
        .where(
            and(
                eq(adminSessions.tokenHash, hashToken(rawToken)),
                and(
                    isNull(adminSessions.revokedAt),
                    gt(adminSessions.expiresAt, now),
                    gt(
                        adminSessions.lastActivityAt,
                        new Date(now.getTime() - lastActivityAtMs),
                    ),
                ),
            ),
        )
        .returning();

    return session
        ? { valid: true as const, session }
        : { valid: false as const };
};

export const revokeByRawToken = (rawToken: string) => {
    const adminSessionsData = db
        .update(adminSessions)
        .set({ revokedAt: new Date() })
        .where(
            and(
                eq(adminSessions.tokenHash, hashToken(rawToken)),
                isNull(adminSessions.revokedAt),
            ),
        );

    return adminSessionsData;
};

export const revokeAllForAdmin = (id: string, except?: string) => {
    return revokeAdminSessions(db, id, except);
};
export const authenticatedAdmin = async (adminId: string) => {
    const admin = await findAdmin({ client: db, id: adminId });

    if (!admin || !admin.isActive) {
        return undefined;
    }

    return { admin, permissions: await adminPermissionsFor(db, adminId) };
};

export const logout = async (
    adminId: string,
    sessionId: string,
    all: boolean,
    context: { ip?: string | undefined; userAgent?: string | undefined },
) => {
    await db.transaction(async (tx) => {
        const admin = await lockAdmin({ client: tx, id: adminId });

        if (all && admin) {
            await updateAdmin({
                client: tx,
                id: adminId,
                values: {
                    authVersion: admin.authVersion + 1,
                },
            });
        }

        if (all) {
            await revokeAdminSessions(tx, adminId);
            await invalidateChallenges(tx, adminId);
        }

        if (!all) {
            await revokeStoredAdminSession(tx, adminId, sessionId);
        }

        await insertAudit(tx, {
            adminId,
            action: all ? "LOGOUT_ALL" : "LOGOUT",
            ...context,
        });
    });
};

export const revokeSession = async (
    adminId: string,
    id: string,
    context: { ip?: string | undefined; userAgent?: string | undefined },
) => {
    await db.transaction(async (tx) => {
        await lockAdmin({ client: tx, id: adminId });

        if (!(await revokeStoredAdminSession(tx, adminId, id))) {
            throw new ApiError({
                statusCode: 404,
                message: "Session not found",
            });
        }

        await insertAudit(tx, {
            adminId,
            action: "SESSION_REVOKED",
            entityId: id,
            ...context,
        });
    });
};

export const adminPermissionsFor = async (
    client: DatabaseClient,
    id: string,
) => {
    const adminPermissionsData = await client
        .select({ permission: adminPermissions.permission })
        .from(adminPermissions)
        .where(eq(adminPermissions.adminId, id));

    return adminPermissionsData.map((row) => row.permission);
};

export const insertAdminSession = async (
    client: DatabaseClient,
    values: typeof adminSessions.$inferInsert,
) => {
    const [adminSessionsData] = await client
        .insert(adminSessions)
        .values(values)
        .returning();

    return adminSessionsData;
};

export const lockActiveSession = async (
    client: DatabaseClient,
    adminId: string,
    id: string,
) => {
    const [adminSessionsData] = await client
        .select()
        .from(adminSessions)
        .where(
            and(
                eq(adminSessions.id, id),
                eq(adminSessions.adminId, adminId),
                and(
                    isNull(adminSessions.revokedAt),
                    gt(adminSessions.expiresAt, new Date()),
                    gt(
                        adminSessions.lastActivityAt,
                        new Date(new Date().getTime() - lastActivityAtMs),
                    ),
                ),
            ),
        )
        .for("update");

    return adminSessionsData;
};

export const revokeAdminSessions = async (
    client: DatabaseClient,
    adminId: string,
    exceptId?: string,
) => {
    const adminSessionsData = await client
        .update(adminSessions)
        .set({ revokedAt: new Date() })
        .where(
            and(
                eq(adminSessions.adminId, adminId),
                isNull(adminSessions.revokedAt),
                exceptId ? ne(adminSessions.id, exceptId) : undefined,
            ),
        );

    return adminSessionsData;
};

export const revokeStoredAdminSession = async (
    client: DatabaseClient,
    adminId: string,
    id: string,
) => {
    const [adminSessionsData] = await client
        .update(adminSessions)
        .set({ revokedAt: new Date() })
        .where(
            and(eq(adminSessions.adminId, adminId), eq(adminSessions.id, id)),
        )
        .returning({ id: adminSessions.id });

    return adminSessionsData;
};

export const listSessions = async (adminId: string) => {
    const adminSessionsData = await db
        .select({
            id: adminSessions.id,
            ip: adminSessions.ip,
            userAgent: adminSessions.userAgent,
            createdAt: adminSessions.createdAt,
            lastActivityAt: adminSessions.lastActivityAt,
            expiresAt: adminSessions.expiresAt,
        })
        .from(adminSessions)
        .where(
            and(
                eq(adminSessions.adminId, adminId),
                and(
                    isNull(adminSessions.revokedAt),
                    gt(adminSessions.expiresAt, new Date()),
                    gt(
                        adminSessions.lastActivityAt,
                        new Date(new Date().getTime() - lastActivityAtMs),
                    ),
                ),
            ),
        );

    return adminSessionsData;
};

export const cleanupSessions = async () => {
    await db.transaction(async (tx) => {
        const result = await tx.execute<{ locked: boolean }>(
            sql`select pg_try_advisory_xact_lock(73294103) as locked`,
        );

        if (!result.rows[0] || !result.rows[0].locked) {
            return;
        }

        await tx.execute(
            sql`delete from admin_sessions where id in (select id from admin_sessions where expires_at < now() - interval '7 days' or revoked_at < now() - interval '7 days' or last_activity_at < now() - interval '7 days 30 minutes' limit 1000)`,
        );
        await tx.execute(
            sql`delete from admin_mfa_login_sessions where id in (select id from admin_mfa_login_sessions where expires_at < now() - interval '7 days' limit 1000)`,
        );
        await tx.execute(
            sql`delete from login_attempts where id in (select id from login_attempts where created_at < now() - interval '7 days' limit 1000)`,
        );
        await tx.execute(
            sql`delete from admin_rate_limits where key in (select key from admin_rate_limits where reset_at < now() - interval '1 day' limit 1000)`,
        );
        await tx.execute(
            sql`delete from user_sessions where id in (select id from user_sessions where expires_at < now() - interval '7 days' limit 1000)`,
        );
    });
};
