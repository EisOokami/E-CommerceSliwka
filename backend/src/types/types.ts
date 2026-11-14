import type { admins, adminSessions } from "../db/schema.js";
import type { Request } from "express";
import type { Permission } from "../utils/permissions.js";

export interface IGetUserRequest extends Request {
    user?: { id: string };
}

export interface IAdminRequest extends Request {
    admin?: typeof admins.$inferSelect;
    adminPermissions?: Permission[];
    adminSession?: typeof adminSessions.$inferSelect;
    adminStepUpVersion?: number;
}

interface Base {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    publishedAt: Date | null;
}

export interface CartItem {
    id: string;
    quantity: number;
    product: {
        id: string;
    };
    user: {
        id: string;
    };
}

enum AuthProvider {
    local,
    google,
}

export interface User extends Base {
    username: string;
    email: string;
    password: string;
    resetPasswordToken: string | null;
    confirmed: boolean | null;
    confirmationToken: string | null;
    confirmationTokenExpires: Date | null;
    blocked: boolean | null;
    agreeToTermsAndPrivacy: boolean;
    avatarId: string | null;
    google_id: string | null;
    authProvider: AuthProvider;
    resetToken: string | null;
    resetTokenExpiresAt: Date | null;
    mfaEnabled: boolean;
    mfaSecret: string | null;
    mfaEnabledAt: Date | null;
}

export interface GoogleProfile {
    googleId: string;
    email: string;
    emailVerified: boolean;
    name: string;
    surname: string;
    avatarUrl: string | null;
}

export interface PaymentSession {
    id: string;
    url: string | null;
    payment_status: string;
    status: string | null;
    amount_total: number | null;
    currency: string | null;
    expires_at: number;
}

export interface PaymentGateway {
    create(input: {
        orderId: string;
        email: string;
        expiresAt: number;
        lines: { name: string; amount: number }[];
    }): Promise<PaymentSession>;
    retrieve(id: string): Promise<PaymentSession>;
    expire(id: string): Promise<unknown>;
}
