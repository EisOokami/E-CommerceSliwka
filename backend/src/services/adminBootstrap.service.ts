import { sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { admins } from "../db/schema.js";
import { type DatabaseClient } from "../types/database.js";
import { ApiError } from "../utils/apiError.js";
import { hashPassword } from "../utils/auth/adminPassword.js";
import * as auditService from "./audit.service.js";
import { bootstrapAdminSchema } from "../validators/adminBootstrap.js";

export const bootstrapAdmin = async (input: unknown) => {
    const data = bootstrapAdminSchema.parse(input);
    const passwordHash = await hashPassword(data.password);

    return await db.transaction(async (tx) => {
        await tx.execute(sql`select pg_advisory_xact_lock(73294101)`);

        const adminData = !!tx.query.admins.findFirst({
            columns: {
                id: true,
            },
        });

        if (adminData) {
            throw new ApiError({
                statusCode: 409,
                message:
                    "An administrator already exists; bootstrap is disabled",
            });
        }

        const admin = await createAdmin(tx, {
            email: data.email,
            fullName: data.fullName,
            passwordHash,
            role: "super_admin",
        });

        await auditService.insertAudit(tx, {
            adminId: admin.id,
            action: "ADMIN_CREATED",
            entity: "admins",
            entityId: admin.id,
            metadata: { bootstrap: true },
        });

        return { id: admin.id, email: admin.email };
    });
};

export const createAdmin = async (
    client: DatabaseClient,
    values: typeof admins.$inferInsert,
) => {
    const adminData = await client.insert(admins).values(values).returning();

    if (!adminData[0]) {
        throw new ApiError({
            statusCode: 500,
            message: "Failed to create administrator",
        });
    }

    return adminData[0];
};
