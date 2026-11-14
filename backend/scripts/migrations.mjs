import { readFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";

export async function migrate(pool, { initialize = false } = {}) {
    const client = await pool.connect();

    try {
        await client.query("SELECT pg_advisory_lock(73294102)");

        await client.query(
            "CREATE TABLE IF NOT EXISTS admin_schema_migrations (name text PRIMARY KEY, checksum text NOT NULL, applied_at timestamptz NOT NULL DEFAULT now())",
        );

        if (initialize) {
            const { rows } = await client.query(
                "SELECT to_regclass('public.users') AS users",
            );

            if (rows[0].users) {
                throw new Error(
                    "--initialize requires an empty ecommerce database; use db:migrate for an existing database",
                );
            }

            await apply("baseline/0000_initial.sql");
        }

        if (!initialize) {
            const { rows } = await client.query(
                "SELECT to_regclass('public.orders') AS orders",
            );

            if (!rows[0].orders) {
                throw new Error(
                    "No ecommerce schema found. Use db:initialize on an empty database",
                );
            }
        }

        const names = (
            await readdir(new URL("../migrations/", import.meta.url))
        )
            .filter((name) => /^\d{4}_[a-z0-9_]+\.sql$/.test(name))
            .sort();

        for (const name of names) {
            await apply(name);
        }

        async function apply(name) {
            const source = await readFile(
                new URL("../migrations/" + name, import.meta.url),
                "utf8",
            );
            const checksum = createHash("sha256").update(source).digest("hex");

            const { rows } = await client.query(
                "SELECT checksum FROM admin_schema_migrations WHERE name = $1",
                [name],
            );

            if (rows.length) {
                return;
            }

            if (rows.length && rows[0].checksum !== checksum) {
                throw new Error("Migration checksum mismatch: " + name);
            }

            await client.query("BEGIN");

            try {
                await client.query(source);

                await client.query(
                    "INSERT INTO admin_schema_migrations(name, checksum) VALUES ($1, $2)",
                    [name, checksum],
                );

                await client.query("COMMIT");
            } catch (error) {
                await client.query("ROLLBACK");

                throw error;
            }
        }
    } finally {
        await client.query("SELECT pg_advisory_unlock(73294102)");

        client.release();
    }
}
