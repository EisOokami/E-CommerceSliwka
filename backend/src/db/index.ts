import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import dotenv from "dotenv";
import * as schema from "./schema.js";

dotenv.config({ quiet: true });

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
});

export const db = drizzle(pool, {
    schema: schema,
});
