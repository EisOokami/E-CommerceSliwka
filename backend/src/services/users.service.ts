import bcrypt from "bcryptjs";
import crypto from "crypto";
import { and, desc, eq, gt, isNotNull, lt, ne, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import {
    carts,
    couponRedemptions,
    files,
    loginAttempts,
    mfaLoginSessions,
    orders,
    reviews,
    userSessions,
    users,
    wishlists,
} from "../db/schema.js";
import { ApiError } from "../utils/apiError.js";
import { recordTermsAcceptance } from "./legalAcceptance.service.js";
import { hashToken } from "../utils/auth/mfa.js";
import { escapeHtml, transporter } from "../utils/email/email.js";
import { emailTemplate } from "../utils/email/emailTemplate.js";
import { sendEmailChangeMails } from "../utils/email/sendEmailChangeMails.js";
import { eraseUser, expireCheckoutSessions } from "./accountErasure.service.js";
import { legalVersions } from "../config/legal.js";

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
            password: true,
            termsVersion: true,
            privacyVersion: true,
        },
    });

    if (!user) {
        throw new ApiError({ statusCode: 404, message: "User not found" });
    }

    const { terms, privacy } = legalVersions();

    const { password, termsVersion, privacyVersion, ...profile } = user;

    return {
        status: "success",
        message: "User found",
        user: {
            ...profile,
            hasPassword: password !== null,
            requiresTermsAcceptance:
                termsVersion !== terms || privacyVersion !== privacy,
        },
    };
};

export const acceptTerms = async (userId: string) => {
    const { terms, privacy } = await recordTermsAcceptance(userId);

    return {
        status: "success",
        message: "Thank you. The updated documents have been accepted",
        termsVersion: terms,
        privacyVersion: privacy,
    };
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
        const [current] = await tx
            .select({ password: users.password })
            .from(users)
            .where(eq(users.id, userId))
            .for("update");

        if (!current || current.password !== user.password) {
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

export const requestAccountDeletionCode = async (userId: string) => {
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: { id: true, username: true, email: true, password: true },
    });

    if (!user) {
        throw new ApiError({ statusCode: 404, message: "User not found" });
    }

    if (user.password) {
        throw new ApiError({
            statusCode: 400,
            message: "Confirm account deletion with your password",
        });
    }

    const code = crypto.randomInt(0, 1000000).toString().padStart(6, "0");

    await db
        .update(users)
        .set({
            deletionCodeHash: hashToken(code),
            deletionCodeExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
            deletionCodeAttempts: 0,
            updatedAt: sql`NOW()`,
        })
        .where(eq(users.id, userId));

    await sendAccountDeletionCode(user, code);

    return {
        status: "success",
        message:
            "We sent a confirmation code to your email. It is valid for 15 minutes.",
    };
};

export const deleteAccount = async (
    userId: string,
    data: { password?: string | undefined; code?: string | undefined },
) => {
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: { id: true, password: true },
    });

    if (!user) {
        throw new ApiError({ statusCode: 404, message: "User not found" });
    }

    if (user.password) {
        if (
            !data.password ||
            !(await bcrypt.compare(data.password, user.password))
        ) {
            throw new ApiError({
                statusCode: 400,
                message: "Incorrect password",
            });
        }
    }

    if (!user.password) {
        if (!data.code) {
            throw new ApiError({
                statusCode: 400,
                message: "Enter the code we sent to your email",
            });
        }

        const [attempt] = await db
            .update(users)
            .set({
                deletionCodeAttempts: sql`${users.deletionCodeAttempts} + 1`,
            })
            .where(
                and(
                    eq(users.id, userId),
                    isNotNull(users.deletionCodeHash),
                    gt(users.deletionCodeExpiresAt, sql`NOW()`),
                    lt(users.deletionCodeAttempts, 5),
                ),
            )
            .returning({ codeHash: users.deletionCodeHash });

        if (!attempt || !attempt.codeHash) {
            throw new ApiError({
                statusCode: 400,
                message: "The code has expired. Request a new one",
            });
        }

        if (
            !crypto.timingSafeEqual(
                Buffer.from(hashToken(data.code)),
                Buffer.from(attempt.codeHash),
            )
        ) {
            throw new ApiError({
                statusCode: 400,
                message: "Incorrect code",
            });
        }
    }

    const result = await db.transaction(async (tx) => {
        const [current] = await tx
            .select({ password: users.password })
            .from(users)
            .where(eq(users.id, userId))
            .for("update");

        if (!current || current.password !== user.password) {
            throw new ApiError({
                statusCode: 409,
                message: "Credentials changed. Sign in again.",
            });
        }

        return eraseUser(tx, userId);
    });

    if (result?.openCheckoutSessions.length) {
        await expireCheckoutSessions(result.openCheckoutSessions);
    }
};

export const exportData = async (userId: string) => {
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: {
            id: true,
            username: true,
            email: true,
            pendingEmail: true,
            avatarUrl: true,
            authProvider: true,
            googleId: true,
            confirmed: true,
            blocked: true,
            mfaEnabled: true,
            mfaEnabledAt: true,
            agreeToTermsAndPrivacy: true,
            termsAcceptedAt: true,
            termsVersion: true,
            privacyAcceptedAt: true,
            privacyVersion: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    if (!user) {
        throw new ApiError({ statusCode: 404, message: "User not found" });
    }

    const [
        sessions,
        attempts,
        cartRows,
        wishlistRows,
        orderRows,
        reviewRows,
        redemptions,
        uploads,
    ] = await Promise.all([
        db
            .select({
                ip: userSessions.ip,
                userAgent: userSessions.userAgent,
                createdAt: userSessions.createdAt,
                lastUsedAt: userSessions.lastUsedAt,
                expiresAt: userSessions.expiresAt,
                revoked: userSessions.revoked,
            })
            .from(userSessions)
            .where(eq(userSessions.userId, userId))
            .orderBy(desc(userSessions.createdAt)),
        db
            .select({
                ip: loginAttempts.ip,
                success: loginAttempts.success,
                createdAt: loginAttempts.createdAt,
            })
            .from(loginAttempts)
            .where(eq(loginAttempts.email, user.email))
            .orderBy(desc(loginAttempts.createdAt)),
        db
            .select({
                productId: carts.productId,
                quantity: carts.quantity,
                createdAt: carts.createdAt,
            })
            .from(carts)
            .where(eq(carts.userId, userId)),
        db
            .select({
                productId: wishlists.productId,
                createdAt: wishlists.createdAt,
            })
            .from(wishlists)
            .where(eq(wishlists.userId, userId)),
        db
            .select({
                orderId: orders.orderId,
                createdAt: orders.createdAt,
                totalMinor: orders.totalMinor,
                currency: orders.currency,
                isSuccess: orders.isSuccess,
                deliveryStatus: orders.deliveryStatus,
                cartItems: orders.cartItems,
            })
            .from(orders)
            .where(eq(orders.userId, userId))
            .orderBy(desc(orders.createdAt)),
        db.query.reviews.findMany({
            where: eq(reviews.userId, userId),
            columns: {
                productId: true,
                rating: true,
                description: true,
                visible: true,
                publicationDate: true,
                lastEdited: true,
            },
            with: { files: { columns: { fileUrl: true } } },
        }),
        db
            .select({
                couponId: couponRedemptions.couponId,
                discountMinor: couponRedemptions.discountMinor,
                usedAt: couponRedemptions.usedAt,
            })
            .from(couponRedemptions)
            .where(eq(couponRedemptions.userId, userId)),
        db
            .select({
                fileUrl: files.fileUrl,
                mimeType: files.mimeType,
                sizeBytes: files.sizeBytes,
                createdAt: files.createdAt,
            })
            .from(files)
            .where(eq(files.uploaderId, userId)),
    ]);

    return {
        exportedAt: new Date().toISOString(),
        note: "Demo store: orders were never fulfilled and payments ran in Stripe test mode. Card and address details entered on the Stripe page are kept only by Stripe.",
        account: user,
        sessions,
        loginAttempts: attempts,
        cart: cartRows,
        wishlist: wishlistRows,
        orders: orderRows.map(({ cartItems, ...order }) => ({
            ...order,
            items: cartItems.map((item) => ({
                productId: item.product.id,
                name: "name" in item.product ? item.product.name : undefined,
                quantity: item.quantity,
            })),
        })),
        reviews: reviewRows.map(({ files: reviewFiles, ...review }) => ({
            ...review,
            images: reviewFiles.map((file) => file.fileUrl),
        })),
        couponRedemptions: redemptions,
        uploadedFiles: uploads,
    };
};

const sendAccountDeletionCode = async (
    user: { username: string; email: string },
    code: string,
) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Confirm account deletion",
            html: emailTemplate({
                logo: "cid:app-logo",
                title: "Confirm account deletion",
                heading: "Confirm account deletion",
                description: `Hello <strong>${escapeHtml(user.username)}</strong>, we received a request to permanently delete your account. Enter this code on the account settings page to confirm:<br /><br /><strong style="font-size:28px;letter-spacing:6px;">${code}</strong>`,
                footer: "The code is valid for 15 minutes. If you didn't request this, ignore this email: your account stays active.",
            }),
            attachments: [
                {
                    filename: "logo.png",
                    path: "./assets/generallogo.png",
                    cid: "app-logo",
                },
            ],
        });
    } catch {
        throw new ApiError({
            statusCode: 503,
            message:
                "Email delivery is temporarily unavailable. Please try again.",
        });
    }
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
