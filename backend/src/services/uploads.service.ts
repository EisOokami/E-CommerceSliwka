import { and, eq, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { fileDeletions, files, reviews, users } from "../db/schema.js";
import { ApiError } from "../utils/apiError.js";
import * as imageStorageService from "./imageStorage.service.js";

export const uploadMultiple = async (
    userId: string,
    reviewId: string | undefined,
    filesArg: Express.Multer.File[],
    field: "avatar" | "review" | "file",
) => {
    if (
        !filesArg.length ||
        filesArg.length > 10 ||
        (field === "avatar" && filesArg.length !== 1)
    ) {
        throw new ApiError({ statusCode: 400, message: "Invalid image count" });
    }

    const stored: Awaited<
        ReturnType<typeof imageStorageService.storeProductImage>
    >[] = [];

    try {
        for (const file of filesArg) {
            stored.push(await imageStorageService.storeProductImage(file));
        }

        return await db.transaction(async (tx) => {
            if (field === "review") {
                if (!reviewId) {
                    throw new ApiError({
                        statusCode: 400,
                        message: "ReviewId is required when field is 'review'",
                    });
                }

                const [review] = await tx
                    .select({ id: reviews.id })
                    .from(reviews)
                    .where(
                        and(
                            eq(reviews.id, reviewId),
                            eq(reviews.userId, userId),
                        ),
                    )
                    .for("update");

                if (!review) {
                    throw new ApiError({
                        statusCode: 404,
                        message: "Review not found",
                    });
                }

                const existing = await tx
                    .select({ id: files.id })
                    .from(files)
                    .where(eq(files.reviewId, reviewId));

                if (existing.length + stored.length > 10) {
                    throw new ApiError({
                        statusCode: 409,
                        message: "A review supports at most ten images",
                    });
                }
            }

            const [user] = await tx
                .select()
                .from(users)
                .where(eq(users.id, userId))
                .for("update");

            if (!user || user.blocked) {
                throw new ApiError({
                    statusCode: 403,
                    message: "Access denied",
                });
            }

            const inserted = await tx
                .insert(files)
                .values(
                    stored.map((image) => ({
                        ...image,
                        uploaderId: userId,
                        reviewId:
                            field === "review" && reviewId ? reviewId : null,
                    })),
                )
                .returning();

            if (field === "avatar") {
                const image = inserted[0];

                if (!image) {
                    throw new ApiError({
                        statusCode: 500,
                        message: "Failed to save avatar image",
                    });
                }

                await tx
                    .update(users)
                    .set({
                        avatarId: image.id,
                        avatarUrl: image.fileUrl,
                        updatedAt: new Date(),
                    })
                    .where(eq(users.id, userId));

                if (user.avatarId) {
                    const [old] = await tx
                        .delete(files)
                        .where(
                            and(
                                eq(files.id, user.avatarId),
                                eq(files.uploaderId, userId),
                                sql`${files.fileUrl} ~ ${/^\/files\/(admin-[a-f0-9-]{36}\.webp)$/.source}`,
                            ),
                        )
                        .returning();

                    if (old) {
                        await tx
                            .insert(fileDeletions)
                            .values({ fileUrl: old.fileUrl })
                            .onConflictDoNothing();
                    }
                }
            }

            return inserted.map((image) => ({
                id: image.id,
                url: image.fileUrl,
                filename: image.filename,
                size: image.sizeBytes,
            }));
        });
    } catch (error) {
        await Promise.allSettled(
            stored.map((image) =>
                imageStorageService.removeStoredFile(image.fileUrl),
            ),
        );

        throw error;
    }
};

export const uploadSingle = async (
    userId: string,
    reviewId: string | undefined,
    file: Express.Multer.File,
    field: "avatar" | "review" | "file",
) => {
    const [result] = await uploadMultiple(userId, reviewId, [file], field);

    return result;
};

export const deleteFile = async (userId: string, id: string) => {
    return await db.transaction(async (tx) => {
        const [file] = await tx
            .select()
            .from(files)
            .where(and(eq(files.id, id), eq(files.uploaderId, userId)))
            .for("update");

        if (!file) {
            throw new ApiError({ statusCode: 404, message: "File not found" });
        }

        if (!/^\/files\/(admin-[a-f0-9-]{36}\.webp)$/.test(file.fileUrl)) {
            throw new ApiError({
                statusCode: 409,
                message:
                    "Legacy file requires storage migration before deletion",
            });
        }

        await tx
            .update(users)
            .set({ avatarId: null, avatarUrl: null, updatedAt: new Date() })
            .where(and(eq(users.id, userId), eq(users.avatarId, id)));

        await tx.delete(files).where(eq(files.id, id));

        await tx
            .insert(fileDeletions)
            .values({ fileUrl: file.fileUrl })
            .onConflictDoNothing();
    });
};
