import { and, eq, gt, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { adminRateLimits, loginAttempts } from "../db/schema.js";
import { ApiError } from "../utils/apiError.js";
import { hashToken } from "../utils/auth/adminSessionPolicy.js";

export const reserveIp = async (ip: string, time: number) => {
    const resetAt = new Date(Date.now() + time);
    const [row] = await db
        .insert(adminRateLimits)
        .values({ key: "ip:" + hashToken(ip), count: 1, resetAt })
        .onConflictDoUpdate({
            target: adminRateLimits.key,
            set: {
                count: sql`case when ${adminRateLimits.resetAt} <= now() then 1 else ${adminRateLimits.count} + 1 end`,
                resetAt: sql`case when ${adminRateLimits.resetAt} <= now() then ${resetAt} else ${adminRateLimits.resetAt} end`,
            },
        })
        .returning();

    return row;
};

export const getRecentFailureCount = async (email: string) => {
    const [row] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(loginAttempts)
        .where(
            and(
                eq(loginAttempts.email, email),
                eq(loginAttempts.success, false),
                gt(loginAttempts.createdAt, new Date(Date.now() - 15 * 60000)),
            ),
        );

    return row && row.count ? row.count : 0;
};

export const isLockedOut = async (email: string) => {
    const [row] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(loginAttempts)
        .where(
            and(
                eq(loginAttempts.email, email),
                eq(loginAttempts.success, false),
                gt(loginAttempts.createdAt, new Date(Date.now() - 15 * 60000)),
            ),
        );

    return row && row.count && row.count >= 8;
};

export const reserveAccount = async (email: string) => {
    const resetAt = new Date(Date.now() + 15 * 60000);
    const [row] = await db
        .insert(adminRateLimits)
        .values({ key: "account:" + hashToken(email), count: 1, resetAt })
        .onConflictDoUpdate({
            target: adminRateLimits.key,
            set: {
                count: sql`case when ${adminRateLimits.resetAt} <= now() then 1 else ${adminRateLimits.count} + 1 end`,
                resetAt: sql`case when ${adminRateLimits.resetAt} <= now() then ${resetAt} else ${adminRateLimits.resetAt} end`,
            },
        })
        .returning();

    if (row && row.count > 30) {
        throw new ApiError({
            statusCode: 429,
            message: "Too many attempts. Try later",
        });
    }
};

export const applyProgressiveDelay = async (email: string) => {
    const [row] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(loginAttempts)
        .where(
            and(
                eq(loginAttempts.email, email),
                eq(loginAttempts.success, false),
                gt(loginAttempts.createdAt, new Date(Date.now() - 15 * 60000)),
            ),
        );

    const failures = row && row.count ? row.count : 0;

    if (failures) {
        await new Promise((resolve) =>
            setTimeout(
                resolve,
                Math.min(250 * 2 ** Math.min(failures, 5), 8000),
            ),
        );
    }
};

export const record = async (
    email: string,
    ip: string | undefined,
    success: boolean,
) => {
    return await db.insert(loginAttempts).values({ email, ip, success });
};
