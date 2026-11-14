import bcrypt from "bcryptjs";
import crypto from "crypto";
import dotenv from "dotenv";
import { and, eq, gt, isNull, sql } from "drizzle-orm";
import { jwtVerify, type JWTPayload } from "jose";
import { db } from "../db/index.js";
import {
    mfaLoginSessions,
    oauthExchangeCodes,
    users,
    userSessions,
} from "../db/schema.js";
import { ApiError } from "../utils/apiError.js";
import { exchangeCodeForProfile } from "../utils/auth/googleAuth.js";
import {
    createAccessToken,
    createRefreshToken,
    revokeAllUserSessions,
    revokeSessionChain,
    rotateRefreshToken,
    verifyRefreshToken,
} from "../utils/auth/jwt.js";
import { generateRawToken, hashToken } from "../utils/auth/mfa.js";
import { generateCsrfToken } from "../utils/csrf.js";
import { transporter } from "../utils/email/email.js";
import { emailTemplate } from "../utils/email/emailTemplate.js";
import { confirmEmailChange } from "./users.service.js";

dotenv.config({ quiet: true });

const refreshSecret = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET);

export const register = async (
    username: string,
    email: string,
    password: string,
) => {
    const existingEmailUser = await db.query.users.findFirst({
        columns: {
            id: true,
        },
        where: eq(users.email, email),
    });

    if (existingEmailUser) {
        throw new ApiError({
            statusCode: 409,
            message: "Email already in use",
        });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const confirmationToken = crypto.randomBytes(32).toString("hex");
    const confirmationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const createdUser = await db
        .insert(users)
        .values({
            username: username,
            password: hashedPassword,
            email: email,
            confirmed: false,
            agreeToTermsAndPrivacy: true,
            confirmationToken: confirmationToken,
            confirmationTokenExpires: confirmationTokenExpires,
        })
        .returning({ id: users.id });

    if (!createdUser[0]) {
        throw new ApiError({
            statusCode: 400,
            message: "Failed to register",
        });
    }

    const userId = createdUser[0].id;

    const user = await db.query.users.findFirst({
        columns: {
            id: true,
            username: true,
            email: true,
            createdAt: true,
        },
        where: eq(users.id, userId),
    });

    if (!user) {
        throw new ApiError({
            statusCode: 400,
            message: "Failed to retrieve user",
        });
    }

    const verificationUrl = `${process.env.FRONTEND_URL}/verifyEmail?token=${confirmationToken}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Welcome! Activate your account",
        html: emailTemplate({
            logo: "cid:app-logo",
            title: "Verify Email",
            heading: `Welcome, ${user.username}!`,
            description:
                "Thanks for creating an account. Please verify your email address to activate your account.",
            buttonText: "Verify Email",
            buttonUrl: verificationUrl,
            footer: "This verification link will expire in 24 hours. If you didn't create this account, simply ignore this email.",
        }),
        attachments: [
            {
                filename: "logo.png",
                path: "./assets/generallogo.png",
                cid: "app-logo",
            },
        ],
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch {
        throw new ApiError({
            statusCode: 503,
            message:
                "Email delivery is temporarily unavailable. Please try again.",
        });
    }
};

export const verifyEmail = async (token: string) => {
    const user = await db.query.users.findFirst({
        columns: {
            id: true,
            confirmed: true,
            confirmationTokenExpires: true,
        },
        where: eq(users.confirmationToken, String(token)),
    });

    if (!user) {
        return await confirmEmailChange(String(token));
    }

    if (user.confirmed) {
        return {
            status: "success",
            message: "Email already verified",
        };
    }

    if (
        !user.confirmationTokenExpires ||
        new Date(user.confirmationTokenExpires) < new Date()
    ) {
        throw new ApiError({
            statusCode: 400,
            message: "Verification token has expired",
        });
    }

    await db
        .update(users)
        .set({
            confirmed: true,
            confirmationToken: null,
            confirmationTokenExpires: null,
            updatedAt: sql`NOW()`,
        })
        .where(
            and(
                eq(users.id, user.id),
                eq(users.confirmationToken, token),
                gt(users.confirmationTokenExpires, sql`NOW()`),
            ),
        );
};

export const resendVerificationEmail = async (email: string) => {
    const user = await db.query.users.findFirst({
        columns: {
            id: true,
            username: true,
            email: true,
            confirmed: true,
        },
        where: eq(users.email, email),
    });

    if (!user) {
        return {
            status: "success",
            message:
                "If this email is registered and not verified, a new verification link has been sent.",
        };
    }

    if (user.confirmed) {
        return {
            status: "success",
            message:
                "If this email is registered and not verified, a new verification link has been sent.",
        };
    }

    const confirmationToken = crypto.randomBytes(32).toString("hex");
    const confirmationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await db
        .update(users)
        .set({
            confirmed: false,
            confirmationToken: confirmationToken,
            confirmationTokenExpires: confirmationTokenExpires,
            updatedAt: sql`NOW()`,
        })
        .where(and(eq(users.id, user.id), eq(users.confirmed, false)));

    const verificationUrl = `${process.env.FRONTEND_URL}/verifyEmail?token=${confirmationToken}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Confirm your email address",
        html: emailTemplate({
            logo: "cid:app-logo",
            title: "Confirm your email",
            heading: "Confirm your email address",
            description: `
                    Hello <strong>${user.username}</strong>,
                    <br><br>
                    We received a request to activate your account.
                    Please confirm your email address by clicking the button below.
                `,
            children: `
                    <div
                        style="
                            margin-top:28px;
                            padding:20px;
                            background:#fafafa;
                            border:1px solid #e5e5e5;
                            border-radius:12px;
                        "
                    >
                        <p
                            style="
                                margin:0;
                                font-size:14px;
                                line-height:24px;
                                color:#71717a;
                            "
                        >
                            <strong style="color:#0a0a0a;">
                                Security note:
                            </strong>
                            This verification link is valid for 24 hours.
                        </p>
                    </div>
                `,
            buttonText: "Activate Account",
            buttonUrl: verificationUrl,
            footer: "If you did not create this account, you can ignore this email.",
        }),
        attachments: [
            {
                filename: "logo.png",
                path: "./assets/generallogo.png",
                cid: "app-logo",
            },
        ],
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch {
        throw new ApiError({
            statusCode: 503,
            message:
                "Email delivery is temporarily unavailable. Please try again.",
        });
    }
};

export const login = async (
    email: string,
    password: string,
    ip: string | undefined,
    userAgent: string | undefined,
) => {
    const user = await db.query.users.findFirst({
        columns: {
            id: true,
            username: true,
            email: true,
            password: true,
            authProvider: true,
            mfaEnabled: true,
            blocked: true,
            confirmed: true,
        },
        where: eq(users.email, email),
    });

    if (
        !user ||
        user.blocked ||
        user.authProvider === "google" ||
        !user.password
    ) {
        throw new ApiError({
            statusCode: 401,
            message: "Invalid email or password",
        });
    }

    if (!user.confirmed) {
        throw new ApiError({
            statusCode: 403,
            message: "Please verify your email before logging in",
            data: {
                requiresVerification: true,
            },
        });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new ApiError({
            statusCode: 401,
            message: "Invalid email or password",
        });
    }

    if (user.mfaEnabled) {
        const tempToken = generateRawToken();

        await db
            .insert(mfaLoginSessions)
            .values({
                tokenHash: hashToken(tempToken),
                userId: user.id,
                ip: ip ?? null,
                userAgent: userAgent ?? null,
                expiresAt: sql`NOW() + INTERVAL '5 minutes'`,
            })
            .returning({ id: mfaLoginSessions.id });

        return {
            status: "success",
            message: "MFA verification required",
            requiresMfa: true,
            tempToken,
        };
    }

    const accessToken = await createAccessToken({
        id: user.id,
    });
    const refreshToken = await createRefreshToken(user.id, ip, userAgent);
    const csrfToken = generateCsrfToken();

    return {
        status: "success",
        message: "User logged in successfully",
        accessToken,
        refreshToken,
        csrfToken,
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
        },
    };
};

export const forgotPassword = async (email: string) => {
    const user = await db.query.users.findFirst({
        columns: {
            id: true,
            username: true,
            password: true,
            email: true,
        },
        where: eq(users.email, email),
    });

    if (!user) {
        return {
            status: "success",
            message:
                "If this email exists, you will receive reset instructions",
        };
    }

    if (!user.password) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password reset request",
            html: emailTemplate({
                logo: "cid:app-logo",
                title: "Reset Password",
                heading: "Sign-in via Google",
                description: `Hi ${user.username}, we received a request to reset the password for this account, but it was created using Google Sign-In and doesn't have a password yet. Please continue signing in with Google. If you'd like, you can add a password afterward in your account security settings.`,
                footer: "If you didn't request this, you can safely ignore this email.",
            }),
            attachments: [
                {
                    filename: "logo.png",
                    path: "./assets/generallogo.png",
                    cid: "app-logo",
                },
            ],
        };

        try {
            await transporter.sendMail(mailOptions);
        } catch {
            throw new ApiError({
                statusCode: 503,
                message:
                    "Email delivery is temporarily unavailable. Please try again.",
            });
        }

        return {
            status: "success",
            message:
                "If this email exists, you will receive reset instructions",
        };
    }

    const token = crypto.randomBytes(32).toString("hex");
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(token, salt);

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    const result = await db
        .update(users)
        .set({
            resetToken: hash,
            resetTokenExpiresAt: expiresAt,
            updatedAt: sql`NOW()`,
        })
        .where(eq(users.id, user.id));

    if (result.rowCount === 0) {
        throw new ApiError({
            statusCode: 400,
            message: "Something went wrong... Try again",
        });
    }

    const resetLink = `${process.env.FRONTEND_URL}/resetPassword?token=${token}&id=${user.id}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password reset request",
        html: emailTemplate({
            logo: "cid:app-logo",
            title: "Reset Password",
            heading: "Reset your password",
            description: `Hi ${user.username}, we received a request to reset your password.`,
            buttonText: "Reset Password",
            buttonUrl: resetLink,
            footer: "This reset link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.",
        }),
        attachments: [
            {
                filename: "logo.png",
                path: "./assets/generallogo.png",
                cid: "app-logo",
            },
        ],
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch {
        throw new ApiError({
            statusCode: 503,
            message:
                "Email delivery is temporarily unavailable. Please try again.",
        });
    }

    return {
        status: "success",
        message: "If this email exists, you will receive reset instructions",
    };
};

export const resetPassword = async (
    token: string,
    password: string,
    id: string,
    ip: string | undefined,
    userAgent: string | undefined,
) => {
    const user = await db.query.users.findFirst({
        columns: {
            id: true,
            username: true,
            email: true,
            resetToken: true,
            resetTokenExpiresAt: true,
        },
        where: eq(users.id, id),
    });

    if (!user || !user.resetToken) {
        throw new ApiError({
            statusCode: 400,
            message: "Invalid or expired password reset token",
        });
    }

    const resetToken = user.resetToken;

    if (
        user.resetTokenExpiresAt &&
        new Date(user.resetTokenExpiresAt) < new Date()
    ) {
        await db
            .update(users)
            .set({
                resetToken: null,
                resetTokenExpiresAt: null,
                updatedAt: sql`NOW()`,
            })
            .where(
                and(eq(users.id, user.id), eq(users.resetToken, resetToken)),
            );

        throw new ApiError({
            statusCode: 401,
            message: "Password reset token has expired",
        });
    }

    const isTokenValid = await bcrypt.compare(token, user.resetToken);

    if (!isTokenValid) {
        throw new ApiError({
            statusCode: 401,
            message: "Invalid or expired password reset token",
        });
    }

    const currentUser = await db.query.users.findFirst({
        columns: {
            password: true,
        },
        where: eq(users.id, id),
    });

    if (!currentUser || !currentUser.password) {
        throw new ApiError({
            statusCode: 401,
            message: "Failed to retrieve user",
        });
    }

    const isSamePassword = await bcrypt.compare(password, currentUser.password);

    if (isSamePassword) {
        throw new ApiError({
            statusCode: 400,
            message: "New password must be different from current password",
        });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await db.transaction(async (tx) => {
        const [userData] = await tx
            .select({ id: users.id })
            .from(users)
            .where(
                and(
                    eq(users.id, id),
                    eq(users.resetToken, resetToken),
                    gt(users.resetTokenExpiresAt, sql`NOW()`),
                ),
            )
            .for("update");

        if (!userData) {
            return { rowCount: 0 };
        }

        const result = await tx
            .update(users)
            .set({
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiresAt: null,
                pendingEmail: null,
                emailChangeToken: null,
                emailChangeExpiresAt: null,
                updatedAt: new Date(),
            })
            .where(eq(users.id, id));

        await tx
            .update(userSessions)
            .set({ revoked: true, replacedBy: null, replacedAt: null })
            .where(eq(userSessions.userId, id));

        await tx
            .delete(mfaLoginSessions)
            .where(eq(mfaLoginSessions.userId, id));

        return result;
    });

    if (result.rowCount === 0) {
        throw new ApiError({
            statusCode: 400,
            message: "Failed to reset password",
        });
    }

    await revokeAllUserSessions(user.id);

    const accessToken = await createAccessToken({
        id: user.id,
    });
    const refreshToken = await createRefreshToken(user.id, ip, userAgent);

    if (!refreshToken) {
        throw new ApiError({
            statusCode: 500,
            message: "Failed to create session",
        });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Password Reset Successfully",
        html: emailTemplate({
            logo: "cid:app-logo",
            title: "Password Changed",
            heading: "Password updated",
            description: `Hi ${user.username}, your password has been changed successfully.`,
            children: `
                    <div
                        style="
                            margin-top:30px;
                            padding:18px;
                            background:#fafafa;
                            border:1px solid #e5e5e5;
                            border-radius:10px;
                    ">
                        <strong style="color:#0a0a0a;">
                            Didn't do this?
                        </strong>
                        <p
                            style="
                                margin:10px 0 0;
                                color:#71717a;
                                line-height:24px;
                        ">
                            Secure your account immediately and contact support if you believe someone accessed your account.
                        </p>
                    </div>
                `,
            footer: "This is an automated security notification.",
        }),
        attachments: [
            {
                filename: "logo.png",
                path: "./assets/generallogo.png",
                cid: "app-logo",
            },
        ],
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch {
        throw new ApiError({
            statusCode: 503,
            message:
                "Email delivery is temporarily unavailable. Please try again.",
        });
    }

    return {
        status: "success",
        message: "The password has been successfully reset",
        accessToken,
        refreshToken,
    };
};

export const refresh = async (
    refreshToken: string,
    ip: string | undefined,
    userAgent: string | undefined,
) => {
    let payload: JWTPayload;

    try {
        ({ payload } = await verifyRefreshToken(refreshToken));
    } catch {
        throw new ApiError({
            statusCode: 401,
            message: "Invalid token",
        });
    }

    const userId = payload.sub;

    if (!userId) {
        throw new ApiError({
            statusCode: 401,
            message: "Invalid token",
        });
    }

    const newRefreshToken = await rotateRefreshToken(
        refreshToken,
        ip,
        userAgent,
    );

    if (!newRefreshToken) {
        throw new ApiError({
            statusCode: 500,
            message: "Failed to refresh session",
        });
    }

    const newAccessToken = await createAccessToken({ id: userId });
    const csrfToken = generateCsrfToken();

    return {
        status: "success",
        message: "The token has been updated",
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        csrfToken: csrfToken,
    };
};

export const logout = async (refreshToken: string) => {
    const { payload } = await jwtVerify(refreshToken, refreshSecret, {
        algorithms: ["HS256"],
    });

    const sid = payload.sid;
    const userId = payload.sub;

    if (!sid || typeof sid !== "string" || !userId) {
        throw new ApiError({
            statusCode: 401,
            message: "Invalid token",
        });
    }

    await revokeSessionChain(sid, userId);
};

export const googleAuthCallback = async (code: string) => {
    const profile = await exchangeCodeForProfile(code);

    if (!profile.emailVerified) {
        return {
            redirect: `${process.env.FRONTEND_URL}/signIn?error=email_not_verified`,
        };
    }

    let userId = undefined;

    const byGoogleId = await db.query.users.findFirst({
        columns: {
            id: true,
        },
        where: eq(users.googleId, profile.googleId),
    });

    if (byGoogleId) {
        userId = byGoogleId.id;
    }

    if (!userId) {
        const byEmail = await db.query.users.findFirst({
            columns: {
                id: true,
                googleId: true,
                confirmed: true,
            },
            where: eq(users.email, profile.email),
        });

        if (byEmail && byEmail.googleId) {
            return {
                redirect: `${process.env.FRONTEND_URL}/signIn?error=oauth_failed`,
            };
        }

        if (byEmail) {
            const unverified = byEmail.confirmed !== true;

            await db.transaction(async (tx) => {
                await tx
                    .update(users)
                    .set({
                        googleId: profile.googleId,
                        avatarUrl: sql`COALESCE(${users.avatarUrl}, ${profile.avatarUrl})`,
                        updatedAt: sql`NOW()`,
                        ...(unverified
                            ? {
                                  password: null,
                                  authProvider: "google" as const,
                                  confirmed: true,
                                  confirmationToken: null,
                                  confirmationTokenExpires: null,
                                  resetToken: null,
                                  resetTokenExpiresAt: null,
                                  pendingEmail: null,
                                  emailChangeToken: null,
                                  emailChangeExpiresAt: null,
                              }
                            : {}),
                    })
                    .where(
                        and(eq(users.id, byEmail.id), isNull(users.googleId)),
                    );

                if (unverified) {
                    await tx
                        .update(userSessions)
                        .set({
                            revoked: true,
                            replacedBy: null,
                            replacedAt: null,
                        })
                        .where(eq(userSessions.userId, byEmail.id));

                    await tx
                        .delete(mfaLoginSessions)
                        .where(eq(mfaLoginSessions.userId, byEmail.id));
                }
            });

            userId = byEmail.id;
        }
    }

    if (!userId) {
        const [userRow] = await db
            .insert(users)
            .values({
                email: profile.email,
                googleId: profile.googleId,
                authProvider: "google",
                confirmed: true,
                username: `${profile.name} ${profile.surname}`,
                avatarUrl: profile.avatarUrl,
                password: null,
                agreeToTermsAndPrivacy: true,
            })
            .returning({ id: users.id });

        if (!userRow) {
            throw new ApiError({
                statusCode: 400,
                message: "Error creating data",
            });
        }

        userId = userRow.id;
    }

    const exchangeCode = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60000);

    const result = await db
        .insert(oauthExchangeCodes)
        .values({
            code: exchangeCode,
            userId: userId,
            expiresAt: expiresAt,
        })
        .returning({ id: oauthExchangeCodes.code });

    if (!result[0] || !result[0].id) {
        return {
            redirect: `${process.env.FRONTEND_URL}/signIn?error=oauth_failed`,
        };
    }

    return {
        redirect: `${process.env.FRONTEND_URL}/callback?code=${exchangeCode}`,
    };
};

export const googleAuthExchange = async (
    code: string,
    ip: string | undefined,
    userAgent: string | undefined,
) => {
    const expiredCode = await db.query.oauthExchangeCodes.findFirst({
        where: and(
            eq(oauthExchangeCodes.code, code),
            isNull(oauthExchangeCodes.usedAt),
            gt(oauthExchangeCodes.expiresAt, sql`NOW()`),
        ),
    });

    if (!expiredCode) {
        throw new ApiError({
            statusCode: 400,
            message: "Invalid or expired code",
        });
    }

    const result = await db
        .update(oauthExchangeCodes)
        .set({
            usedAt: sql`NOW()`,
        })
        .where(
            and(
                eq(oauthExchangeCodes.code, code),
                isNull(oauthExchangeCodes.usedAt),
                gt(oauthExchangeCodes.expiresAt, sql`NOW()`),
            ),
        );

    if (result.rowCount === 0) {
        throw new ApiError({
            statusCode: 400,
            message: "Something went wrong... Try again",
        });
    }

    const userId = expiredCode.userId;

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

    if (!user || user.blocked || !user.confirmed) {
        throw new ApiError({ statusCode: 401, message: "Account unavailable" });
    }

    if (user.mfaEnabled) {
        const tempToken = generateRawToken();

        await db
            .insert(mfaLoginSessions)
            .values({
                tokenHash: hashToken(tempToken),
                userId: userId,
                ip: ip ?? null,
                userAgent: userAgent ?? null,
                expiresAt: sql`NOW() + INTERVAL '5 minutes'`,
            })
            .returning({ id: mfaLoginSessions.id });

        return {
            status: "success",
            message: "MFA verification required",
            requiresMfa: true,
            tempToken,
        };
    }

    const refreshToken = await createRefreshToken(userId, ip, userAgent);

    if (!refreshToken) {
        throw new ApiError({
            statusCode: 500,
            message: "Failed to create session",
        });
    }

    const accessToken = await createAccessToken({ id: userId });
    const csrfToken = generateCsrfToken();

    return {
        status: "success",
        message: "User logged in successfully",
        accessToken,
        refreshToken,
        csrfToken,
    };
};
