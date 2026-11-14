import dotenv from "dotenv";
import { Pool } from "pg";
import { migrate } from "./migrations.mjs";

dotenv.config({ path: new URL("../.env", import.meta.url), quiet: true });

if (!process.env.DATABASE_URL) {
    throw new Error(
        "DATABASE_URL must be provided in the environment or baexpressjs/.env",
    );
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 10000,
});

try {
    await migrate(pool, { initialize: process.argv.includes("--initialize") });

    console.log("Migrations applied");
} catch (error) {
    console.error(
        "Migration failed:",
        error instanceof Error ? error.message : "Unknown error",
    );

    process.exitCode = 1;
} finally {
    await pool.end();
}
