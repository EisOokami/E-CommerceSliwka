import crypto from "crypto";
import dotenv from "dotenv";
import { ApiError } from "../apiError.js";

dotenv.config({ quiet: true });

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

function getEncryptionKey(): Buffer {
    const key = process.env.MFA_ENCRYPTION_KEY;

    if (!key) {
        throw new ApiError({ statusCode: 500, message: "Invalid key" });
    }

    if (!/^[0-9a-fA-F]{64}$/.test(key)) {
        throw new ApiError({
            statusCode: 500,
            message: "Invalid key",
        });
    }

    return Buffer.from(key, "hex");
}

export function encryptMfaSecret(plainSecret: string): Buffer {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    const encrypted = Buffer.concat([
        cipher.update(plainSecret, "utf8"),
        cipher.final(),
    ]);

    const authTag = cipher.getAuthTag();

    return Buffer.concat([iv, authTag, encrypted]);
}

export function decryptMfaSecret(encryptedData: Buffer): string {
    const key = getEncryptionKey();

    const iv = encryptedData.subarray(0, IV_LENGTH);
    const authTag = encryptedData.subarray(
        IV_LENGTH,
        IV_LENGTH + AUTH_TAG_LENGTH,
    );
    const ciphertext = encryptedData.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
        decipher.update(ciphertext),
        decipher.final(),
    ]);

    return decrypted.toString("utf8");
}

export function generateRawToken(bytes = 32): string {
    return crypto.randomBytes(bytes).toString("hex");
}

export function hashToken(rawToken: string): string {
    return crypto.createHash("sha256").update(rawToken).digest("hex");
}

export function generateBackupCode(): string {
    const part1 = crypto.randomBytes(4).toString("hex").slice(0, 4);
    const part2 = crypto.randomBytes(4).toString("hex").slice(0, 4);

    return `${part1}-${part2}`.toUpperCase();
}
