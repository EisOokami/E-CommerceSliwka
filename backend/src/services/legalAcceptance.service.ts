import { eq, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { legalVersions } from "../config/legal.js";

export const recordTermsAcceptance = async (userId: string) => {
    const { terms, privacy } = legalVersions();
    const now = new Date();

    await db
        .update(users)
        .set({
            agreeToTermsAndPrivacy: true,
            termsAcceptedAt: now,
            termsVersion: terms,
            privacyAcceptedAt: now,
            privacyVersion: privacy,
            updatedAt: sql`NOW()`,
        })
        .where(eq(users.id, userId));

    return {
        terms: terms,
        privacy: privacy,
    };
};
