import type { db } from "../db/index.js";

export type DatabaseTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
export type DatabaseClient = DatabaseTransaction | typeof db;
