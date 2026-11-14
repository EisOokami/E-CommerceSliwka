import { createHash, randomBytes } from "node:crypto";

export const expressAtMs = 8 * 60 * 60 * 1000;
export const lastActivityAtMs = 30 * 60 * 1000;

export const hashToken = (token: string) => {
    return createHash("sha256").update(token).digest("hex");
};

export const newToken = () => {
    return randomBytes(32).toString("base64url");
};

export const sessionIsActive = (
    session: { revokedAt: Date | null; expiresAt: Date; lastActivityAt: Date },
    now = Date.now(),
) => {
    return (
        !session.revokedAt &&
        session.expiresAt.getTime() > now &&
        session.lastActivityAt.getTime() + lastActivityAtMs > now
    );
};
