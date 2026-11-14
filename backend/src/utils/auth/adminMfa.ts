import dotenv from "dotenv";
import crypto from "crypto";
import { ApiError } from "../apiError.js";

dotenv.config({ quiet: true });

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

function getKey(): Buffer {
    const key = process.env.MFA_ENCRYPTION_KEY;

    if (!key || Buffer.from(key, "base64").length !== 32) {
        throw new ApiError({
            statusCode: 500,
            message: "Invalid key",
        });
    }

    return Buffer.from(key, "base64");
}

export function encryptSecret(plaintext: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);

    const ciphertext = Buffer.concat([
        cipher.update(plaintext, "utf8"),
        cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();

    return [
        iv.toString("base64"),
        authTag.toString("base64"),
        ciphertext.toString("base64"),
    ].join(":");
}

export function decryptSecret(stored: string): string {
    const parts = stored.split(":");

    if (parts.length !== 3) {
        throw new ApiError({
            statusCode: 400,
            message: "Malformed encrypted secret",
        });
    }

    const [ivB64, authTagB64, ciphertextB64] = parts as [
        string,
        string,
        string,
    ];

    const iv = Buffer.from(ivB64, "base64");
    const authTag = Buffer.from(authTagB64, "base64");
    const ciphertext = Buffer.from(ciphertextB64, "base64");

    const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
    decipher.setAuthTag(authTag);

    const plaintext = Buffer.concat([
        decipher.update(ciphertext),
        decipher.final(),
    ]);

    return plaintext.toString("utf8");
}
