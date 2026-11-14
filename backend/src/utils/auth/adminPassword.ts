import * as argon2 from "argon2";

const ARGON2_OPTIONS = {
    type: argon2.argon2id,
    memoryCost: 131072,
    timeCost: 2,
    parallelism: 1,
} as const;

export async function hashPassword(plaintext: string) {
    if (typeof plaintext !== "string" || plaintext.length === 0) {
        throw new Error("Password must be a non-empty string");
    }

    return argon2.hash(plaintext, ARGON2_OPTIONS);
}

export async function verifyPassword(storedHash: string, plaintext: string) {
    try {
        return await argon2.verify(storedHash, plaintext);
    } catch {
        return false;
    }
}

export function isOutdated(storedHash: string) {
    return argon2.needsRehash(storedHash, ARGON2_OPTIONS);
}
