import { eq } from "drizzle-orm";
import { fileTypeFromBuffer } from "file-type";
import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { db } from "../db/index.js";
import { fileDeletions } from "../db/schema.js";
import { ApiError } from "../utils/apiError.js";

const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);

export const storeProductImage = async (file: Express.Multer.File) => {
    if (
        !file ||
        file.size >
            Math.min(
                20 * 1024 * 1024,
                Math.max(
                    1024,
                    Number(process.env.MAX_IMAGE_BYTES) || 5 * 1024 * 1024,
                ),
            )
    ) {
        throw new ApiError({
            statusCode: 413,
            message: "Image exceeds the upload limit",
        });
    }

    const type = await fileTypeFromBuffer(file.buffer).catch(() => undefined);

    if (!type || !allowed.has(type.mime) || type.mime !== file.mimetype) {
        throw new ApiError({
            statusCode: 415,
            message: "Upload a valid JPEG, PNG or WebP image",
        });
    }

    let buffer: Buffer;

    try {
        buffer = await sharp(file.buffer, {
            limitInputPixels: 40000000,
            failOn: "warning",
            animated: false,
        })
            .rotate()
            .webp({ quality: 85 })
            .toBuffer();
    } catch {
        throw new ApiError({
            statusCode: 415,
            message: "Image is corrupted or exceeds the pixel limit",
        });
    }

    if (
        buffer.length >
        Math.min(
            20 * 1024 * 1024,
            Math.max(
                1024,
                Number(process.env.MAX_IMAGE_BYTES) || 5 * 1024 * 1024,
            ),
        )
    ) {
        throw new ApiError({
            statusCode: 413,
            message: "Processed image exceeds the upload limit",
        });
    }

    const filename = "admin-" + randomUUID() + ".webp";

    await mkdir(
        path.resolve(
            process.env.UPLOAD_DIR ?? path.join(process.cwd(), "uploads"),
        ),
        { recursive: true },
    );
    await writeFile(
        path.join(
            path.resolve(
                process.env.UPLOAD_DIR ?? path.join(process.cwd(), "uploads"),
            ),
            filename,
        ),
        buffer,
        { flag: "wx" },
    );

    return {
        filename,
        fileUrl: "/files/" + filename,
        mimeType: "image/webp",
        sizeBytes: buffer.length,
    };
};

export const removeStoredFile = async (fileUrl: string) => {
    const match =
        /^\/files\/(admin-[a-f0-9-]{36}\.webp|strapi-[a-f0-9]{64}\.(?:jpe?g|png|webp|gif))$/.exec(
            fileUrl,
        );

    if (!match || !match[1]) {
        throw new ApiError({
            statusCode: 409,
            message: "This file is managed by another upload workflow",
        });
    }

    await unlink(
        path.join(
            path.resolve(
                process.env.UPLOAD_DIR ?? path.join(process.cwd(), "uploads"),
            ),
            match[1],
        ),
    ).catch((error) => {
        if (error.code !== "ENOENT") {
            throw error;
        }
    });
};

export const pendingFileDeletions = () => {
    return db.select().from(fileDeletions).limit(100);
};

export const finishFileDeletion = (url: string) => {
    return db.delete(fileDeletions).where(eq(fileDeletions.fileUrl, url));
};
