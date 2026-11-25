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
    IDeleteAccountAction,
    IUpdateProfileAction,
} from "@/interfaces/data";
import {
    changePasswordSchema,
    deleteAccountSchema,
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

export async function requestAccountDeletionCodeAction(): Promise<IDeleteAccountAction> {
    try {
        const result = await mutateData<{ message?: string }>(
            "POST",
            "/api/users/me/deletion-code",
        );

        return {
            ...emptyAction,
            codeSent: true,
            message:
                result?.message ?? "We sent a confirmation code to your email.",
        };
    } catch (error) {
        return {
            ...actionFailure(error),
            codeSent: false,
        };
    }
}

export async function deleteAccountAction(
    userId: string,
    _previous: IDeleteAccountAction | undefined,
    form: FormData,
): Promise<IDeleteAccountAction> {
    const codeSent = form.get("delete-code-sent") === "true";
    const validateData = deleteAccountSchema.safeParse({
        password: form.get("delete-password") || undefined,
        code: form.get("delete-code") || undefined,
        confirm: form.get("delete-confirm"),
    });

    if (!validateData.success) {
        return {
            ...emptyAction,
            codeSent,
            zodErrors: z.flattenError(validateData.error).fieldErrors,
        };
    }

    try {
        await mutateData("DELETE", "/api/users/" + encodeURIComponent(userId), {
            ...(validateData.data.password
                ? { password: validateData.data.password }
                : {}),
            ...(validateData.data.code ? { code: validateData.data.code } : {}),
        });
    } catch (error) {
        return {
            ...actionFailure(error),
            codeSent,
        };
    }

    const cookieStore = await cookies();

    ["accessToken", "refreshToken", "csrfToken", "customer_mfa"].forEach(
        (name) => {
            cookieStore.delete(name);
        },
    );

    redirect("/?accountDeleted=1");
}
