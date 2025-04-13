"use server";

import qs from "qs";
import { z } from "zod";
import { mutateData } from "@/data/services/mutateData";
import { revalidatePath } from "next/cache";

const schemaAccount = z
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
    })
    .superRefine((val, ctx) => {
        if (val.password !== val.confirmPassword) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Password is not the same as confirm password",
                path: ["confirmPassword"],
            });
        }
    });

export async function updateProfileAction(
    userId: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prevState: any,
    formData: FormData,
) {
    const validatedFields = schemaAccount.safeParse({
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirm-password"),
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

    const payload = {
        username: rawFormData.username,
        email: rawFormData.email,
        password: rawFormData["confirm-password"],
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
