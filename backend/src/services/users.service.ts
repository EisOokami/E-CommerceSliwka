import bcrypt from "bcryptjs";
import crypto from "crypto";
import { and, eq, gt, ne, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { mfaLoginSessions, userSessions, users } from "../db/schema.js";
import { ApiError } from "../utils/apiError.js";
import { hashToken } from "../utils/auth/mfa.js";
import { sendEmailChangeMails } from "../utils/email/sendEmailChangeMails.js";

export const me = async (userId: string) => {
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: {
            id: true,
            username: true,
            email: true,
            avatarUrl: true,
            mfaEnabled: true,
            authProvider: true,
            confirmed: true,
            blocked: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    if (!user) {
        throw new ApiError({ statusCode: 404, message: "User not found" });
    }

    return { status: "success", message: "User found", user };
};

export const updateUser = async (
    userId: string,
    data: { username?: string; email?: string; currentPassword?: string },
) => {
    const current = await db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: { id: true, username: true, email: true, password: true },
    });

    if (!current) {
        throw new ApiError({ statusCode: 404, message: "User not found" });
    }

    const newEmail =
        data.email && data.email.toLowerCase() !== current.email.toLowerCase()
            ? data.email
            : undefined;

    if (newEmail) {
        if (current.password && !data.currentPassword) {
            throw new ApiError({
                statusCode: 400,
                message: "Enter your current password to change your email",
            });
        }

        if (
            current.password &&
            data.currentPassword &&
            !(await bcrypt.compare(data.currentPassword, current.password))
        ) {
            throw new ApiError({
                statusCode: 400,
                message: "Current password is incorrect",
            });
        }

        const emailInUse = await db.query.users.findFirst({
            where: and(ne(users.id, userId), eq(users.email, newEmail)),
            columns: { id: true },
        });

        if (emailInUse) {
            throw new ApiError({
                statusCode: 409,
                message: "Email already in use",
            });
        }
    }

    const token = newEmail ? crypto.randomBytes(32).toString("hex") : null;

    const [user] = await db
        .update(users)
        .set({
            ...(data.username !== undefined ? { username: data.username } : {}),
            ...(newEmail && token
                ? {
                      pendingEmail: newEmail,
                      emailChangeToken: hashToken(token),
                      emailChangeExpiresAt: new Date(
                          Date.now() + 24 * 60 * 60 * 1000,
                      ),
                  }
                : {}),
            updatedAt: new Date(),
        })
        .where(eq(users.id, userId))
        .returning({
            id: users.id,
            username: users.username,
            email: users.email,
            avatarUrl: users.avatarUrl,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt,
        });

    if (!user) {
        throw new ApiError({ statusCode: 404, message: "User not found" });
    }

    if (newEmail && token) {
        await sendEmailChangeMails(
            { username: user.username, email: current.email },
            newEmail,
            token,
        );
    }

    return {
        status: "success",
        message: newEmail
            ? "Profile updated. To finish changing your email, open the link we sent to the new address"
            : "The profile has been successfully updated",
        user: [user],
    };
};

export const confirmEmailChange = async (token: string) => {
    return await db.transaction(async (tx) => {
        const [user] = await tx
            .select({ id: users.id, pendingEmail: users.pendingEmail })
            .from(users)
            .where(
                and(
                    eq(users.emailChangeToken, hashToken(token)),
                    gt(users.emailChangeExpiresAt, sql`NOW()`),
                ),
            )
            .for("update");

        if (!user || !user.pendingEmail) {
            throw new ApiError({
                statusCode: 400,
                message: "Invalid or expired verification token",
            });
        }

        const emailInUse = await tx.query.users.findFirst({
            where: and(
                ne(users.id, user.id),
                eq(users.email, user.pendingEmail),
            ),
            columns: { id: true },
        });

        if (emailInUse) {
            throw new ApiError({
                statusCode: 409,
                message: "Email already in use",
            });
        }

        await tx
            .update(users)
            .set({
                email: user.pendingEmail,
                pendingEmail: null,
                emailChangeToken: null,
                emailChangeExpiresAt: null,
                updatedAt: sql`NOW()`,
            })
            .where(eq(users.id, user.id));

        return {
            status: "success",
            message: "Your email address has been changed. Use it to sign in",
        };
    });
};

export const changePassword = async (
    userId: string,
    data: { currentPassword: string; newPassword: string },
) => {
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: { id: true, password: true },
    });

    if (!user || !user.password) {
        throw new ApiError({ statusCode: 404, message: "User not found" });
    }

    if (!(await bcrypt.compare(data.currentPassword, user.password))) {
        throw new ApiError({
            statusCode: 400,
            message: "Current password is incorrect",
        });
    }

    if (await bcrypt.compare(data.newPassword, user.password)) {
        throw new ApiError({
            statusCode: 400,
            message: "New password must be different from current password",
        });
    }

    await db.transaction(async (tx) => {
        const [user] = await tx
            .select({ password: users.password })
            .from(users)
            .where(eq(users.id, userId))
            .for("update");

        if (!user || user.password !== user.password) {
            throw new ApiError({
                statusCode: 409,
                message: "Credentials changed. Sign in again.",
            });
        }

        await tx
            .update(users)
            .set({
                password: await bcrypt.hash(data.newPassword, 10),
                authProvider: "local",
                pendingEmail: null,
                emailChangeToken: null,
                emailChangeExpiresAt: null,
                updatedAt: sql`NOW()`,
            })
            .where(eq(users.id, userId));

        await tx
            .update(userSessions)
            .set({ revoked: true, replacedBy: null, replacedAt: null })
            .where(eq(userSessions.userId, userId));

        await tx
            .delete(mfaLoginSessions)
            .where(eq(mfaLoginSessions.userId, userId));
    });
};

export const deleteAccount = async (
    userId: string,
    data: { password: string },
) => {
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: { id: true, password: true },
    });

    if (!user || !user.password) {
        throw new ApiError({ statusCode: 404, message: "User not found" });
    }

    if (!(await bcrypt.compare(data.password, user.password))) {
        throw new ApiError({ statusCode: 401, message: "Incorrect password" });
    }

    await db.transaction(async (tx) => {
        const [userData] = await tx
            .select({ password: users.password })
            .from(users)
            .where(eq(users.id, userId))
            .for("update");

        if (!userData || user.password !== userData.password) {
            throw new ApiError({
                statusCode: 409,
                message: "Credentials changed. Sign in again.",
            });
        }

        return tx.delete(users).where(eq(users.id, userId));
    });
};

export const setPassword = async (
    userId: string,
    data: { newPassword: string },
) => {
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: { id: true, password: true },
    });

    if (!user) {
        throw new ApiError({ statusCode: 404, message: "User not found" });
    }

    if (user.password) {
        throw new ApiError({
            statusCode: 400,
            message: "Password already set. Use change password instead",
        });
    }

    await db.transaction(async (tx) => {
        const [user] = await tx
            .select({ password: users.password })
            .from(users)
            .where(eq(users.id, userId))
            .for("update");

        if (!user || user.password !== null) {
            throw new ApiError({
                statusCode: 409,
                message: "Credentials changed. Sign in again.",
            });
        }

        await tx
            .update(users)
            .set({
                password: await bcrypt.hash(data.newPassword, 10),
                authProvider: "local",
                updatedAt: sql`NOW()`,
            })
            .where(eq(users.id, userId));

        await tx
            .update(userSessions)
            .set({ revoked: true, replacedBy: null, replacedAt: null })
            .where(eq(userSessions.userId, userId));

        await tx
            .delete(mfaLoginSessions)
            .where(eq(mfaLoginSessions.userId, userId));
    });
};
