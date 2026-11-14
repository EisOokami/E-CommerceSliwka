import dotenv from "dotenv";
import { createHmac, randomBytes, timingSafeEqual } from "crypto";

dotenv.config({ quiet: true });

const CSRF_SECRET = process.env.CSRF_SECRET!;

export function generateCsrfToken(): string {
    const raw = randomBytes(32).toString("hex");
    const hmac = createHmac("sha256", CSRF_SECRET).update(raw).digest("hex");

    return `${raw}.${hmac}`;
}

export function verifyCsrfToken(token: string | undefined): boolean {
    if (!token || !token.includes(".")) {
        return false;
    }

    const [raw, hmac] = token.split(".");

    if (!raw || !hmac) {
        return false;
    }

    const expectedHmac = createHmac("sha256", CSRF_SECRET)
        .update(raw)
        .digest("hex");

    const a = Buffer.from(hmac);
    const b = Buffer.from(expectedHmac);

    if (a.length !== b.length) {
        return false;
    }

    return timingSafeEqual(a, b);
}
