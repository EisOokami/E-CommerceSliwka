import { eq } from "drizzle-orm";
import { OTP, generateSecret, generateURI } from "otplib";
import { db } from "../db/index.js";
import { admins } from "../db/schema.js";
import {
    type DatabaseClient,
    type DatabaseTransaction,
} from "../types/database.js";
import { ApiError } from "../utils/apiError.js";
import { decryptSecret, encryptSecret } from "../utils/auth/adminMfa.js";
import { hashPassword, verifyPassword } from "../utils/auth/adminPassword.js";
import {
    expressAtMs,
    hashToken,
    newToken,
} from "../utils/auth/adminSessionPolicy.js";
import * as adminMfaLoginSessionService from "./adminMfaLoginSession.service.js";
import * as auditService from "./audit.service.js";
import * as loginAttemptsService from "./loginAttempts.service.js";
import * as sessionService from "./session.service.js";

const otp = new OTP({ strategy: "totp" });

export const adminLogin = async (
    email: string,
    password: string,
    ip: string | undefined,
    userAgent: string | undefined,
) => {
    await loginAttemptsService.reserveAccount(email);

    if (await loginAttemptsService.isLockedOut(email)) {
        throw new ApiError({
            statusCode: 429,
            message: "Too many attempts. Try later",
        });
    }

    const admin = await findAdminByEmail({ email: email });

    if (!admin || !admin.isActive) {
        await loginAttemptsService.record(email, ip, false);
        await auditService.insertAudit(db, {
            adminId: null,
            action: "LOGIN_FAILED",
            ip: ip ?? "unknown",
            userAgent,
        });
        await loginAttemptsService.applyProgressiveDelay(email);

        throw new ApiError({ statusCode: 401, message: "Invalid credentials" });
    }

    const verifiedPassword = await verifyPassword(
        admin.passwordHash ?? (await hashPassword(newToken())),
        password,
    );

    if (!verifiedPassword) {
        await loginAttemptsService.record(email, ip, false);
        await auditService.insertAudit(db, {
            adminId: null,
            action: "LOGIN_FAILED",
            ip: ip ?? "unknown",
            userAgent,
        });
        await loginAttemptsService.applyProgressiveDelay(email);

        throw new ApiError({ statusCode: 401, message: "Invalid credentials" });
    }

    if (admin.mfaEnabled) {
        const { rawToken } = await adminMfaLoginSessionService.create({
            adminId: admin.id,
            authVersion: admin.authVersion,
            ip,
            userAgent,
        });

        return { mfaRequired: true as const, mfaLoginToken: rawToken };
    }

    const rawToken = newToken();

    await db.transaction(async (tx) => {
        const lockedAdmin = await lockAdmin({ client: tx, id: admin.id });

        if (
            !lockedAdmin ||
            !lockedAdmin.isActive ||
            lockedAdmin.authVersion !== admin.authVersion
        ) {
            throw new ApiError({
                statusCode: 401,
                message: "Invalid credentials",
            });
        }

        if (lockedAdmin.mfaEnabled) {
            const epoch = Math.floor(Date.now() / 1000);
            const step = Math.floor(epoch / 30);

            if (
                !lockedAdmin.mfaSecretEncrypted ||
                (lockedAdmin.mfaLastUsedStep ?? -1) >= step ||
                !(
                    await otp.verify({
                        secret: decryptSecret(lockedAdmin.mfaSecretEncrypted),
                        token: "",
                        epoch,
                        epochTolerance: 0,
                    })
                ).valid
            ) {
                throw new ApiError({
                    statusCode: 401,
                    message: "Invalid credentials",
                });
            }

            await updateAdmin({
                client: tx,
                id: admin.id,
                values: { mfaLastUsedStep: step },
            });
        }

        const now = new Date();

        await sessionService.insertAdminSession(tx, {
            adminId: admin.id,
            tokenHash: hashToken(rawToken),
            expiresAt: new Date(now.getTime() + expressAtMs),
            lastActivityAt: now,
            ip: ip,
            userAgent: userAgent,
        });
        await updateAdmin({
            client: tx,
            id: admin.id,
            values: { lastLoginAt: now },
        });
        await auditService.insertAudit(tx, {
            adminId: admin.id,
            action: "LOGIN",
            ...{ ip: ip, userAgent: userAgent },
        });
    });

    await loginAttemptsService.record(email, ip, true);

    return { mfaRequired: false, rawToken };
};

export const verifyMfa = async (
    token: string,
    code: string,
    ip: string | undefined,
    userAgent: string | undefined,
) => {
    const pending = await adminMfaLoginSessionService.consumeByRawToken(token);

    if (!pending) {
        throw new ApiError({ statusCode: 401, message: "Invalid credentials" });
    }

    const admin = await findAdmin({ id: pending.adminId });

    if (!admin || !admin.isActive || !admin.mfaEnabled) {
        throw new ApiError({ statusCode: 401, message: "Invalid credentials" });
    }

    if (await loginAttemptsService.isLockedOut(admin.email)) {
        throw new ApiError({
            statusCode: 429,
            message: "Too many attempts. Try later",
        });
    }

    try {
        const rawToken = newToken();

        await db.transaction(async (tx) => {
            const lockedAdmin = await lockAdmin({ client: tx, id: admin.id });

            if (
                !lockedAdmin ||
                !lockedAdmin.isActive ||
                lockedAdmin.authVersion !== pending.authVersion
            ) {
                throw new ApiError({
                    statusCode: 401,
                    message: "Invalid credentials",
                });
            }

            if (lockedAdmin.mfaEnabled) {
                const epoch = Math.floor(Date.now() / 1000);
                const step = Math.floor(epoch / 30);

                if (
                    !lockedAdmin.mfaSecretEncrypted ||
                    !/^\d{6}$/.test(code) ||
                    (lockedAdmin.mfaLastUsedStep ?? -1) >= step ||
                    !(
                        await otp.verify({
                            secret: decryptSecret(
                                lockedAdmin.mfaSecretEncrypted,
                            ),
                            token: code,
                            epoch,
                            epochTolerance: 0,
                        })
                    ).valid
                ) {
                    throw new ApiError({
                        statusCode: 401,
                        message: "Invalid credentials",
                    });
                }

                await updateAdmin({
                    client: tx,
                    id: lockedAdmin.id,
                    values: {
                        mfaLastUsedStep: step,
                    },
                });
            }

            const now = new Date();

            await sessionService.insertAdminSession(tx, {
                adminId: admin.id,
                tokenHash: hashToken(rawToken),
                expiresAt: new Date(now.getTime() + expressAtMs),
                lastActivityAt: now,
                ip: ip,
                userAgent: userAgent,
            });
            await updateAdmin({
                client: tx,
                id: admin.id,
                values: { lastLoginAt: now },
            });
            await auditService.insertAudit(tx, {
                adminId: admin.id,
                action: "LOGIN",
                ...{ ip: ip, userAgent: userAgent },
            });
        });

        await loginAttemptsService.record(admin.email, ip, true);

        return { mfaRequired: false, rawToken };
    } catch (error) {
        await loginAttemptsService.record(admin.email, ip, false);
        await auditService.insertAudit(db, {
            adminId: admin.id,
            action: "LOGIN_FAILED",
            ip: ip ?? "unknown",
            userAgent,
        });
        await loginAttemptsService.applyProgressiveDelay(admin.email);

        throw error;
    }
};

export const reauthenticate = async (
    adminId: string,
    sessionId: string,
    password: string,
    code: string,
    context: {
        ip?: string | undefined;
        userAgent?: string | undefined;
    },
) => {
    const admin = await findAdmin({ id: adminId });

    if (!admin || (await loginAttemptsService.isLockedOut(admin.email))) {
        throw new ApiError({ statusCode: 401, message: "Invalid credentials" });
    }

    await loginAttemptsService.reserveAccount(admin.email);

    try {
        if (!(await verifyPassword(admin.passwordHash, password))) {
            throw new ApiError({
                statusCode: 401,
                message: "Invalid credentials",
            });
        }

        await db.transaction(async (tx) => {
            const lockedAdmin = await lockAdmin({ client: tx, id: adminId });

            if (
                !(await sessionService.lockActiveSession(
                    tx,
                    adminId,
                    sessionId,
                ))
            ) {
                throw new ApiError({
                    statusCode: 401,
                    message: "Invalid credentials",
                });
            }

            if (
                !lockedAdmin ||
                !lockedAdmin.isActive ||
                lockedAdmin.passwordHash !== admin.passwordHash ||
                lockedAdmin.authVersion !== admin.authVersion
            ) {
                throw new ApiError({
                    statusCode: 401,
                    message: "Invalid credentials",
                });
            }

            if (!admin.mfaEnabled) {
                return;
            }

            const epoch = Math.floor(Date.now() / 1000);
            const step = Math.floor(epoch / 30);

            if (
                !admin.mfaSecretEncrypted ||
                !/^\d{6}$/.test(code) ||
                (admin.mfaLastUsedStep ?? -1) >= step ||
                !(
                    await otp.verify({
                        secret: decryptSecret(admin.mfaSecretEncrypted),
                        token: code,
                        epoch,
                        epochTolerance: 0,
                    })
                ).valid
            ) {
                throw new ApiError({
                    statusCode: 401,
                    message: "Invalid credentials",
                });
            }

            await updateAdmin({
                client: tx,
                id: admin.id,
                values: { mfaLastUsedStep: step },
            });
            await auditService.insertAudit(tx, {
                adminId,
                action: "STEP_UP_AUTH_SUCCEEDED",
                ...context,
            });
        });

        return admin.authVersion;
    } catch (error) {
        await loginAttemptsService.record(admin.email, context.ip, false);
        await auditService.insertAudit(db, {
            adminId,
            action: "STEP_UP_AUTH_FAILED",
            ...context,
        });
        await loginAttemptsService.applyProgressiveDelay(admin.email);

        throw error;
    }
};

export const setupMfa = async (
    adminId: string,
    email: string,
    sessionId: string,
    version: number,
) => {
    const secret = generateSecret();

    await db.transaction(async (tx) => {
        await assertSensitive(tx, adminId, sessionId, version);
        await updateAdmin({
            client: tx,
            id: adminId,
            values: {
                mfaPendingSecret: encryptSecret(secret),
                mfaPendingExpiresAt: new Date(Date.now() + 10 * 60000),
            },
        });
    });

    return {
        uri: generateURI({ issuer: "Sliwka Admin", label: email, secret }),
    };
};

export const confirmMfa = async (
    adminId: string,
    code: string,
    context: {
        ip?: string | undefined;
        userAgent?: string | undefined;
    },
    sessionId: string,
    version: number,
) => {
    await db.transaction(async (tx) => {
        const admin = await assertSensitive(tx, adminId, sessionId, version);

        if (
            !admin.mfaPendingSecret ||
            !admin.mfaPendingExpiresAt ||
            admin.mfaPendingExpiresAt.getTime() <= Date.now() ||
            !(
                await otp.verify({
                    secret: decryptSecret(admin.mfaPendingSecret),
                    token: code,
                    epochTolerance: 0,
                })
            ).valid
        ) {
            throw new ApiError({
                statusCode: 401,
                message: "Invalid credentials",
            });
        }

        await updateAdmin({
            client: tx,
            id: adminId,
            values: {
                authVersion: admin.authVersion + 1,
                mfaEnabled: true,
                mfaSecretEncrypted: admin.mfaPendingSecret,
                mfaPendingSecret: null,
                mfaPendingExpiresAt: null,
                mfaLastUsedStep: Math.floor(Date.now() / 30000),
            },
        });
        await sessionService.revokeAdminSessions(tx, adminId);
        await adminMfaLoginSessionService.invalidateChallenges(tx, adminId);
        await auditService.insertAudit(tx, {
            adminId,
            action: "MFA_ENABLED",
            ...context,
        });
    });
};

export const changeSecurity = async (
    adminId: string,
    operation: "password" | "disable-mfa",
    password: string | undefined,
    context: {
        ip?: string | undefined;
        userAgent?: string | undefined;
    },
    sessionId: string,
    version: number,
) => {
    const passwordHash =
        operation === "password" && password
            ? await hashPassword(password)
            : undefined;

    await db.transaction(async (tx) => {
        const admin = await assertSensitive(tx, adminId, sessionId, version);

        await updateAdmin({
            client: tx,
            id: adminId,
            values:
                operation === "password" && passwordHash
                    ? {
                          passwordHash: passwordHash,
                          authVersion: admin.authVersion + 1,
                          updatedAt: new Date(),
                      }
                    : {
                          authVersion: admin.authVersion + 1,
                          mfaEnabled: false,
                          mfaSecretEncrypted: null,
                          mfaPendingSecret: null,
                          mfaPendingExpiresAt: null,
                          mfaBackupCodesHash: null,
                          mfaLastUsedStep: null,
                      },
        });
        await sessionService.revokeAdminSessions(tx, adminId);
        await adminMfaLoginSessionService.invalidateChallenges(tx, adminId);
        await auditService.insertAudit(tx, {
            adminId,
            action:
                operation === "password" ? "PASSWORD_CHANGED" : "MFA_DISABLED",
            ...context,
        });
    });
};

export const assertSensitive = async (
    tx: DatabaseTransaction,
    adminId: string,
    sessionId: string,
    version: number,
) => {
    const admin = await lockAdmin({ id: adminId });

    if (
        !admin ||
        !admin.isActive ||
        admin.authVersion !== version ||
        !(await sessionService.lockActiveSession(tx, adminId, sessionId))
    ) {
        throw new ApiError({ statusCode: 401, message: "Invalid credentials" });
    }

    return admin;
};

export const findAdmin = async ({
    client = db,
    id,
}: {
    client?: DatabaseClient;
    id: string;
}) => {
    const adminData = await client.query.admins.findFirst({
        where: eq(admins.id, id),
    });

    return adminData;
};

export const findAdminByEmail = async ({
    client = db,
    email,
}: {
    client?: DatabaseClient;
    email: string;
}) => {
    const adminData = await client.query.admins.findFirst({
        where: eq(admins.email, email),
    });

    return adminData;
};

export const lockAdmin = async ({
    client = db,
    id,
}: {
    client?: DatabaseClient;
    id: string;
}) => {
    const adminData = await client
        .select()
        .from(admins)
        .where(eq(admins.id, id))
        .for("update");

    return adminData[0];
};

export const updateAdmin = async ({
    client = db,
    id,
    values,
}: {
    client?: DatabaseClient;
    id: string;
    values: Partial<typeof admins.$inferInsert>;
}) => {
    const response = await client
        .update(admins)
        .set(values)
        .where(eq(admins.id, id));

    return response;
};
