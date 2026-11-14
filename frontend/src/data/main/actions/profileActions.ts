"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { mutateData } from "../services/mutateData";
import { emptyAction, actionFailure } from "../services/actionState";
import { uploadImagesToStrapi } from "../services/uploadImage";
import type {
    IChangePasswordAction,
    IUpdateProfileAction,
} from "@/interfaces/data";
import {
    changePasswordSchema,
    updateProfileSchema,
} from "@/lib/schemas/main/profile";

export async function updateProfileAction(
    _userId: string,
    images: File[] | null,
    _previous: IUpdateProfileAction | undefined,
    form: FormData,
): Promise<IUpdateProfileAction> {
    const validateData = updateProfileSchema.safeParse({
        avatar: images ?? [],
        username: form.get("username"),
        email: form.get("email"),
        currentPassword: form.get("profile-current-password") || undefined,
    });

    if (!validateData.success) {
        return {
            ...emptyAction,
            data: null,
            zodErrors: z.flattenError(validateData.error).fieldErrors,
        };
    }

    let profileSaved = false;

    try {
        const result = await mutateData<{
            message?: string;
        }>("PUT", "/api/users", {
            username: validateData.data.username,
            email: validateData.data.email,
            ...(validateData.data.currentPassword
                ? {
                      currentPassword: validateData.data.currentPassword,
                  }
                : {}),
        });

        profileSaved = true;

        if (images && images.length) {
            await uploadImagesToStrapi(images, {
                field: "avatar",
            });
        }

        revalidatePath("/account");

        return {
            ...emptyAction,
            data: {
                username: validateData.data.username,
                email: validateData.data.email,
            },
            message: result?.message ?? "Profile Updated",
        };
    } catch (error) {
        revalidatePath("/account");

        if (profileSaved) {
            return {
                ...emptyAction,
                data: {
                    username: validateData.data.username,
                    email: validateData.data.email,
                },
                message:
                    "Profile saved, but the avatar upload failed. Please retry the image.",
            };
        }

        return {
            ...actionFailure(error),
            data: null,
        };
    }
}

export async function changePasswordAction(
    _previous: IChangePasswordAction | undefined,
    form: FormData,
): Promise<IChangePasswordAction> {
    const validateData = changePasswordSchema.safeParse({
        currentPassword: form.get("current-password"),
        confirmCurrentPassword: form.get("confirm-current-password"),
        password: form.get("password"),
        confirmPassword: form.get("confirm-password"),
    });

    if (!validateData.success) {
        return {
            ...emptyAction,
            data: null,
            zodErrors: z.flattenError(validateData.error).fieldErrors,
        };
    }

    try {
        await mutateData("POST", "/api/users/change-password", {
            currentPassword: validateData.data.currentPassword,
            newPassword: validateData.data.password,
        });
    } catch (error) {
        return {
            ...actionFailure(error, {
                newPassword: "password",
            }),
            data: null,
        };
    }

    const cookieStore = await cookies();

    ["accessToken", "refreshToken", "csrfToken", "customer_mfa"].forEach(
        (name) => {
            cookieStore.delete(name);
        },
    );

    redirect("/signIn");
}
