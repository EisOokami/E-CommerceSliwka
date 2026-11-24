import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { fileDeletions, files, products } from "../db/schema.js";
import { type IAdminRequest } from "../types/types.js";
import { ApiError } from "../utils/apiError.js";
import * as adminCatalogService from "./adminCatalog.service.js";
import * as adminPanel from "./adminPanel.service.js";
import * as auditService from "./audit.service.js";
import * as imageStorageService from "./imageStorage.service.js";
import type { DatabaseClient } from "../types/database.js";

export const productCategories = () => {
    return adminCatalogService.categoryList();
};

export async function lockFile(tx: DatabaseClient, id: string) {
    return (
        await tx.select().from(files).where(eq(files.id, id)).for("update")
    )[0];
}

export const uploadImage = async (
    file: Express.Multer.File,
    req: IAdminRequest,
) => {
    const stored = await imageStorageService.storeProductImage(file);

    try {
        return await db.transaction(async (tx) => {
            const permission = req.adminPermissions?.includes("products.update")
                ? "products.update"
                : "products.create";
            const actor = await adminPanel.authorize(
                tx,
                req,
                permission,
                false,
            );
            const [image] = await tx.insert(files).values(stored).returning();

            if (!image) {
                throw new ApiError({
                    statusCode: 500,
                    message: "Failed to insert file record into the database",
                });
            }

            await auditService.insertAudit(tx, {
                adminId: actor.id,
                action: "IMAGE_CREATED",
                entity: "files",
                entityId: image.id,
                ip: req.ip,
                userAgent: req.get("user-agent"),
            });

            return {
                id: image.id,
                fileUrl: image.fileUrl,
                filename: image.filename,
            };
        });
    } catch (error) {
        await imageStorageService.removeStoredFile(stored.fileUrl);

        throw error;
    }
};

export const deleteImage = async (id: string, req: IAdminRequest) => {
    await db.transaction(async (tx) => {
        const actor = await adminPanel.authorize(
            tx,
            req,
            "products.delete",
            true,
        );
        const file = await lockFile(tx, id);

        if (!file) {
            throw new ApiError({ statusCode: 404, message: "Image not found" });
        }

        const fileReferenced = !!(await tx.query.products.findFirst({
            columns: {
                id: true,
            },
            where: eq(products.imageId, id),
        }));

        if (
            file.uploaderId ||
            file.reviewId ||
            file.productId ||
            fileReferenced
        ) {
            throw new ApiError({
                statusCode: 409,
                message: "Detach the image from its product before deleting it",
            });
        }

        if (!/^\/files\/(admin-[a-f0-9-]{36}\.webp)$/.test(file.fileUrl)) {
            throw new ApiError({
                statusCode: 409,
                message: "This file is managed by another upload workflow",
            });
        }

        const [fileData] = await tx
            .delete(files)
            .where(eq(files.id, id))
            .returning();

        if (fileData) {
            await tx
                .insert(fileDeletions)
                .values({ fileUrl: file.fileUrl })
                .onConflictDoNothing();
        }

        await auditService.insertAudit(tx, {
            adminId: actor.id,
            action: "IMAGE_DELETED",
            entity: "files",
            entityId: id,
            ip: req.ip,
            userAgent: req.get("user-agent"),
        });

        return file;
    });
};

export const listFiles = async () => {
    const filesData = await db
        .select({
            id: files.id,
            fileUrl: files.fileUrl,
            filename: files.filename,
            productId: files.productId,
            imageRole: files.imageRole,
        })
        .from(files)
        .where(
            and(
                sql`${files.uploaderId} is null`,
                sql`${files.mimeType} like 'image/%'`,
            ),
        )
        .orderBy(desc(files.createdAt))
        .limit(100);

    return filesData;
};
