import { OTP } from "otplib";
import crypto from "crypto";
import dotenv from "dotenv";
import { decryptSecret } from "../utils/auth/adminMfa.js";

dotenv.config({ quiet: true });

const otp = new OTP({ strategy: "totp" });

export const verifyCode = async (encryptedSecret: string, code: string) => {
    const secret = decryptSecret(encryptedSecret);

    const { valid } = await otp.verify({ token: code, secret });

    return valid;
};

export const verifyBackupCode = async (
    storedHashes: string[],
    code: string,
) => {
    const codeHash = crypto
        .createHash("sha256")
        .update(code.trim().toUpperCase())
        .digest("hex");
    const index = storedHashes.indexOf(codeHash);

    if (index === -1) {
        return { valid: false, remaining: storedHashes };
    }

    const remaining = [...storedHashes];
    remaining.splice(index, 1);

    return { valid: true, remaining };
};
