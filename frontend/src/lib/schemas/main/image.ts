import z from "zod";

export const imageSchema = z
    .instanceof(File)
    .refine((file) => {
        return file.size > 0 && file.size <= 5 * 1024 * 1024;
    }, "Images must be between 1 byte and 5 MB.")
    .refine((file) => {
        return file.name.length <= 50;
    }, "Filename must not exceed 50 characters.")
    .refine((file) => {
        return [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
            "image/avif",
        ].includes(file.type);
    }, "Unsupported image type.");

export const imagesSchema = z
    .array(imageSchema)
    .max(5, "Upload no more than five images at a time.");
