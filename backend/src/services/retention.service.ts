import { and, eq, lt, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eraseUser } from "./accountErasure.service.js";

const cleanupUnconfirmedAccounts = async () => {
    const candidates = await db
        .select({ id: users.id })
        .from(users)
        .where(
            and(
                eq(users.confirmed, false),
                lt(
                    users.confirmationTokenExpires,
                    sql`now() - interval '7 days'`,
                ),
            ),
        )
        .limit(100);

    for (const { id } of candidates) {
        try {
            await db.transaction(async (tx) => {
                const [user] = await tx
                    .select({ id: users.id })
                    .from(users)
                    .where(
                        and(
                            eq(users.id, id),
                            and(
                                eq(users.confirmed, false),
                                lt(
                                    users.confirmationTokenExpires,
                                    sql`now() - interval '7 days'`,
                                ),
                            ),
                        ),
                    )
                    .for("update");

                if (user) {
                    await eraseUser(tx, id);
                }
            });
        } catch {
            console.error(
                "Unconfirmed account cleanup failed; will retry on next interval",
            );
        }
    }
};

export const cleanupExpiredData = async () => {
    await db.transaction(async (tx) => {
        const result = await tx.execute<{ locked: boolean }>(
            sql`select pg_try_advisory_xact_lock(73294104) as locked`,
        );

        if (!result.rows[0] || !result.rows[0].locked) {
            return;
        }

        await tx.execute(
            sql`delete from mfa_login_sessions where id in (select id from mfa_login_sessions where coalesce(expires_at, created_at) < now() - interval '24 hours' limit 1000)`,
        );
        await tx.execute(
            sql`delete from oauth_exchange_codes where code in (select code from oauth_exchange_codes where expires_at < now() - interval '24 hours' limit 1000)`,
        );
        await tx.execute(
            sql`delete from orders where id in (select id from orders where created_at < now() - interval '12 months' and stock_reserved = false limit 1000)`,
        );
        await tx.execute(
            sql`delete from admin_audit_logs where id in (select id from admin_audit_logs where created_at < now() - interval '12 months' limit 1000)`,
        );
    });

    await cleanupUnconfirmedAccounts();
};
