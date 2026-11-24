import { and, eq, inArray, ne } from "drizzle-orm";
import { fileDeletions, files, products, users } from "../db/schema.js";
import type { DatabaseTransaction } from "../types/database.js";

export const releaseFiles = async (
    tx: DatabaseTransaction,
    fileIds: string[],
    options: { exceptAvatarOf?: string } = {},
) => {
    if (!fileIds.length) {
        return;
    }

    const rows = await tx
        .select({
            id: files.id,
            fileUrl: files.fileUrl,
            productId: files.productId,
        })
        .from(files)
        .where(inArray(files.id, fileIds))
        .for("update");

    const shared = new Set<string | null>([
        ...(
            await tx
                .select({ id: products.imageId })
                .from(products)
                .where(inArray(products.imageId, fileIds))
        ).map((row) => row.id),
        ...(
            await tx
                .select({ id: users.avatarId })
                .from(users)
                .where(
                    and(
                        inArray(users.avatarId, fileIds),
                        options.exceptAvatarOf
                            ? ne(users.id, options.exceptAvatarOf)
                            : undefined,
                    ),
                )
        ).map((row) => row.id),
    ]);

    for (const file of rows) {
        if (file.productId || shared.has(file.id)) {
            await tx
                .update(files)
                .set({
                    uploaderId: null,
                    reviewId: null,
                    updatedAt: new Date(),
                })
                .where(eq(files.id, file.id));

            continue;
        }

        await tx.delete(files).where(eq(files.id, file.id));

        const stillUsed = await tx
            .select({ id: files.id })
            .from(files)
            .where(eq(files.fileUrl, file.fileUrl))
            .limit(1);

        if (
            !stillUsed.length &&
            /^\/files\/(admin-[a-f0-9-]{36}\.webp|strapi-[a-f0-9]{64}\.(?:jpe?g|png|webp|gif))$/.test(
                file.fileUrl,
            )
        ) {
            await tx
                .insert(fileDeletions)
                .values({ fileUrl: file.fileUrl })
                .onConflictDoNothing();
        }
    }
};
