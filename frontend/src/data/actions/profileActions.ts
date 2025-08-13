"use server";

import qs from "qs";
import { z } from "zod";
import { mutateData } from "@/data/services/mutateData";
import { revalidatePath } from "next/cache";
import { getUserMeLoader } from "../services/getUserMeLoader";
import { uploadImagesToStrapi } from "../services/uploadImage";
import { cookies } from "next/headers";

const config = {
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    domain: process.env.HOST ?? "localhost",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
};

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];

const schemaUpdateProfile = z.object({
    username: z
        .string()
        .min(3, {
            message: "Username must be between 3 and 20 characters",
        })
        .max(20, {
            message: "Username must be between 3 and 20 characters",
        }),
    email: z
        .string()
        .min(3, {
            message: "email must be between 3 and 50 characters",
        })
        .max(50, {
            message: "email must be between 3 and 50 characters",
        })
        .email({
            message: "Please enter a valid email address",
        }),
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

export async function updateProfileAction(
    userId: number,
    imageFromUpload: File[] | null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prevState: any,
    formData: FormData,
) {
    const user = await getUserMeLoader();

    if (!user.ok) {
        console.error(user.ok);
        throw new Error("User not found");
    }

    const rawImage = imageFromUpload || [];
    const filteredImage = rawImage.filter(
        (file) => file instanceof File && file.size > 0,
    );

    const username = formData.get("username")?.toString().trim() || "";
    const email = formData.get("email")?.toString().trim() || "";

    const isSameUsername = username === user.data.username;
    const isSameEmail = email === user.data.email;
    const isSameAvatar = filteredImage.length === 0;

    if (isSameUsername && isSameEmail && isSameAvatar) {
        return {
            ...prevState,
            strapiErrors: { message: "No changes were made" },
            message: "No changes were made",
        };
    }

    const validatedFields = schemaUpdateProfile.safeParse({
        username: formData.get("username"),
        email: formData.get("email"),
        avatar: filteredImage,
    });

    if (!validatedFields.success) {
        return {
            ...prevState,
            formData,
            strapiErrors: null,
            strapiErrorsDetails: null,
            zodErrors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Update Profile.",
        };
    }

    const rawFormData = Object.fromEntries(formData);
    const uploadedImage = rawImage.length
        ? await uploadImagesToStrapi(rawImage as File[])
        : null;

    const query = qs.stringify({
        populate: "*",
    });

    const payload: {
        username: FormDataEntryValue | null;
        email: FormDataEntryValue | null;
        avatar?: string[] | null;
    } = {
        username: rawFormData.username,
        email: rawFormData.email,
    };

    if (uploadedImage) {
        payload.avatar = uploadedImage.map((img: { id: string }) => img.id);
    }

    const responseData = await mutateData(
        "PUT",
        `/api/users/${userId}?${query}`,
        payload,
    );

    if (!responseData) {
        return {
            ...prevState,
            formData,
            strapiErrors: null,
            strapiErrorsDetails: null,
            zodErrors: null,
            message: "Ops! Something went wrong. Please try again.",
        };
    }

    if (responseData.error) {
        return {
            ...prevState,
            formData,
            strapiErrors: responseData.error,
            strapiErrorsDetails:
                responseData.error.details && responseData.error.details.errors
                    ? responseData.error.details.errors
                    : null,
            zodErrors: null,
            message: "Failed to Update Profile.",
        };
    }

    revalidatePath("/account");

    return {
        ...prevState,
        formData: null,
        zodErrors: null,
        message: "Profile Updated",
        data: payload,
        strapiErrors: null,
        strapiErrorsDetails: null,
    };
}

const schemaChangePassword = z
    .object({
        currentPassword: z
            .string()
            .min(6, {
                message: "Password must be between 6 and 100 characters",
            })
            .max(100, {
                message: "Password must be between 6 and 100 characters",
            }),
        confirmCurrentPassword: z
            .string()
            .min(6, { message: "Please confirm your password" })
            .max(100, { message: "Please confirm your password" }),
        password: z.string().optional(),
        confirmPassword: z.string().optional(),
    })
    .superRefine((val, ctx) => {
        if (val.currentPassword !== val.confirmCurrentPassword) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message:
                    "Current password is not the same as confirm current password",
                path: ["confirmCurrentPassword"],
            });
        }

        const hasNew = val.password?.length;
        const hasConfirmNew = val.confirmPassword?.length;

        if (hasNew || hasConfirmNew) {
            if (
                !hasNew ||
                val.password!.length < 6 ||
                val.password!.length > 100
            ) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message:
                        "New password must be between 6 and 100 characters",
                    path: ["password"],
                });
            }

            if (
                !hasConfirmNew ||
                val.confirmPassword!.length < 6 ||
                val.confirmPassword!.length > 100
            ) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Please confirm your new password",
                    path: ["confirmPassword"],
                });
            }

            if (val.password !== val.confirmPassword) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message:
                        "New password is not the same as confirm new password",
                    path: ["confirmPassword"],
                });
            }
        }
    });

export async function changePasswordAction(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prevState: any,
    formData: FormData,
) {
    const user = await getUserMeLoader();

    if (!user.ok) {
        console.error(user.ok);
        throw new Error("User not found");
    }

    const validatedFields = schemaChangePassword.safeParse({
        currentPassword: formData.get("current-password"),
        confirmCurrentPassword: formData.get("confirm-current-password"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirm-password"),
    });

    if (!validatedFields.success) {
        return {
            ...prevState,
            formData,
            zodErrors: validatedFields.error.flatten().fieldErrors,
            strapiErrors: null,
            strapiErrorsDetails: null,
            message: "Missing Fields. Failed to Update Profile.",
        };
    }

    const rawFormData = Object.fromEntries(formData);

    const payload: {
        currentPassword?: FormDataEntryValue | null;
        password?: FormDataEntryValue | null;
        passwordConfirmation?: FormDataEntryValue | null;
    } = {};

    if (validatedFields.data.password && validatedFields.data.confirmPassword) {
        payload["currentPassword"] = rawFormData["current-password"];
        payload["password"] = rawFormData["password"];
        payload["passwordConfirmation"] = rawFormData["confirm-password"];
    }

    const responseData = await mutateData(
        "POST",
        `/api/auth/change-password`,
        payload,
    );

    if (!responseData) {
        return {
            ...prevState,
            formData,
            strapiErrors: null,
            strapiErrorsDetails: null,
            zodErrors: null,
            message: "Ops! Something went wrong. Please try again.",
        };
    }

    if (responseData.error) {
        return {
            ...prevState,
            formData,
            strapiErrors: responseData.error,
            strapiErrorsDetails:
                responseData.error.details && responseData.error.details.errors
                    ? responseData.error.details.errors
                    : null,
            zodErrors: null,
            message: "Failed to Update Profile.",
        };
    }

    const cookieStore = await cookies();
    cookieStore.set("jwt", responseData.jwt, config);
    cookieStore.set("csrfToken", responseData.csrfToken, config);

    revalidatePath("/account");

    return {
        ...prevState,
        formData: null,
        zodErrors: null,
        message: "Profile Updated",
        data: payload,
        strapiErrors: null,
        strapiErrorsDetails: null,
    };
}
