import { desc, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { adminAuditLogs } from "../db/schema.js";
import { type DatabaseClient } from "../types/database.js";

export const insertAudit = async (
    client: DatabaseClient,
    values: typeof adminAuditLogs.$inferInsert,
) => {
    return await client.insert(adminAuditLogs).values(values);
};

export const listAudit = async (adminId: string | undefined, limit: number) => {
    return await db.query.adminAuditLogs.findMany({
        where: adminId ? eq(adminAuditLogs.adminId, adminId) : undefined,
        orderBy: [desc(adminAuditLogs.createdAt), desc(adminAuditLogs.id)],
        limit,
    });
};
