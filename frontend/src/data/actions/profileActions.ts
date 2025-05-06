"use server";

import qs from "qs";
import { z } from "zod";
import { mutateData } from "@/data/services/mutateData";
import { revalidatePath } from "next/cache";
import { getUserMeLoader } from "../services/getUserMeLoader";
import { uploadImagesToStrapi } from "../services/uploadImage";

const schemaUpdateProfile = z
    .object({
        username: z.string().min(3).max(20, {
            message: "Username must be between 3 and 20 characters",
        }),
        email: z.string().email({
            message: "Please enter a valid email address",
        }),
        password: z.string().min(6).max(100, {
            message: "Password must be between 6 and 100 characters",
        }),
        confirmPassword: z
            .string()
            .min(6)
            .max(100, { message: "Please confirm your password" }),
        resetPassword: z.string().optional(),
        confirmResetPassword: z.string().optional(),
    })
    .superRefine((val, ctx) => {
        if (val.password !== val.confirmPassword) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Password is not the same as confirm password",
                path: ["confirmPassword"],
            });
        }

        const hasReset = val.resetPassword?.length;
        const hasConfirmReset = val.confirmResetPassword?.length;

        if (hasReset || hasConfirmReset) {
            if (
                !hasReset ||
                val.resetPassword!.length < 6 ||
                val.resetPassword!.length > 100
            ) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message:
                        "Reset password must be between 6 and 100 characters",
                    path: ["resetPassword"],
                });
            }

            if (
                !hasConfirmReset ||
                val.confirmResetPassword!.length < 6 ||
                val.confirmResetPassword!.length > 100
            ) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Please confirm your reset password",
                    path: ["confirmResetPassword"],
                });
            }

            if (val.resetPassword !== val.confirmResetPassword) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message:
                        "Reset password is not the same as confirm reset password",
                    path: ["confirmResetPassword"],
                });
            }
        }
    });

export async function updateProfileAction(
    userId: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prevState: any,
    formData: FormData,
) {
    const user = await getUserMeLoader();

    if (!user.ok) {
        console.dir(user.ok);
        throw new Error("User not found");
    }

    const validatedFields = schemaUpdateProfile.safeParse({
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirm-password"),
        resetPassword: formData.get("reset-password"),
        confirmResetPassword: formData.get("confirm-reset-password"),
    });

    if (!validatedFields.success) {
        return {
            ...prevState,
            zodErrors: validatedFields.error.flatten().fieldErrors,
            strapiErrors: null,
            message: "Missing Fields. Failed to Update Profile.",
        };
    }

    const rawFormData = Object.fromEntries(formData);

    const query = qs.stringify({
        populate: "*",
    });

    const payload: {
        username: FormDataEntryValue | null;
        email: FormDataEntryValue | null;
        password?: FormDataEntryValue | null;
    } = {
        username: rawFormData.username,
        email: rawFormData.email,
    };

    if (
        validatedFields.data.resetPassword &&
        validatedFields.data.confirmResetPassword
    ) {
        payload["password"] = rawFormData["confirm-reset-password"];
    }

    const responseData = await mutateData(
        "PUT",
        `/api/users/${userId}?${query}`,
        payload,
    );

    if (!responseData) {
        return {
            ...prevState,
            strapiErrors: null,
            message: "Ops! Something went wrong. Please try again.",
        };
    }

    if (responseData.error) {
        return {
            ...prevState,
            strapiErrors: responseData.error,
            message: "Failed to Update Profile.",
        };
    }

    revalidatePath("/account");

    return {
        ...prevState,
        zodErrors: null,
        message: "Profile Updated",
        data: payload,
        strapiErrors: null,
    };
}

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];

const schemaUpdateAvatar = z.object({
    avatar: z
        .any()
        .optional()
        .refine(
            (files: File[]) =>
                !files ||
                files.length === 0 ||
                files.every(
                    (file) =>
                        file.size <= MAX_FILE_SIZE &&
                        ACCEPTED_IMAGE_TYPES.includes(file.type),
                ),
            {
                message:
                    "Only .jpeg, .jpg, .png, .webp files of 5MB or less are accepted",
            },
        ),
});

export async function updateAvatarAction(
    userId: number,
    imageFromUpload: File[] | null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prevState: any,
) {
    const user = await getUserMeLoader();

    if (!user.ok) {
        console.dir(user.ok);
        throw new Error("User not found");
    }

    const rawImage = imageFromUpload || [];
    const filteredImage = rawImage.filter(
        (file) => file instanceof File && file.size > 0,
    );

    const validatedFields = schemaUpdateAvatar.safeParse({
        avatar: filteredImage,
    });

    if (!validatedFields.success) {
        return {
            ...prevState,
            zodErrors: validatedFields.error.flatten().fieldErrors,
            strapiErrors: null,
            message: "Missing Fields. Failed to Update Avatar.",
        };
    }

    const uploadedImage = await uploadImagesToStrapi(rawImage as File[]);

    const query = qs.stringify({
        populate: "*",
    });

    const payload = {
        avatar: uploadedImage
            ? uploadedImage.map((img: { id: string }) => img.id)
            : null,
    };

    const responseData = await mutateData(
        "PUT",
        `/api/users/${userId}?${query}`,
        payload,
    );

    if (!responseData) {
        return {
            ...prevState,
            strapiErrors: null,
            message: "Ops! Something went wrong. Please try again.",
        };
    }

    if (responseData.error) {
        return {
            ...prevState,
            strapiErrors: responseData.error,
            message: "Failed to Update Avatar.",
        };
    }

    revalidatePath("/account");

    return {
        ...prevState,
        zodErrors: null,
        message: "Avatar Updated",
        data: payload,
        strapiErrors: null,
    };
}
