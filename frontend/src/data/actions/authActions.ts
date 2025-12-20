"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { registerUserService, loginUserService } from "../services/authService";
import { ILoginAction, IRegisterAction } from "@/interfaces/data";

const config = {
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    domain: process.env.HOST ?? "localhost",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
};

const schemaRegister = z.object({
    username: z
        .string()
        .min(3, "Username must be between 3 and 40 characters")
        .max(40, "Username must be between 3 and 40 characters")
        .regex(
            /^[A-Za-z\s]+$/,
            "Username must contain only letters and spaces",
        ),
    email: z.string().trim().email("Please enter a valid email address"),
    password: z
        .string()
        .min(8, "Password must be between 8 and 100 characters")
        .max(100, "Password must be between 8 and 100 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/\d/, "Password must contain at least one number")
        .regex(
            /[@$!%*?&#^()\-=+~`'"/|.,;:\[\]{}]/,
            "Password must contain at least one special character (@$!%*?&#^()-=+~`'\"/|.,;:[]{})",
        ),
    agreeToTermsAndPrivacy: z
        .literal("on", {
            errorMap: () => ({
                message: "You must agree to the Terms & Privacy",
            }),
        })
        .transform(() => true),
});

export async function registerUserAction(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prevState: any,
    formData: FormData,
): Promise<IRegisterAction | undefined> {
    const validatedFields = schemaRegister.safeParse({
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        agreeToTermsAndPrivacy: formData.get("terms-and-policy"),
    });

    if (!validatedFields.success) {
        return {
            ...prevState,
            formData,
            strapiErrors: null,
            strapiErrorsDetails: null,
            zodErrors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Register.",
        };
    }

    const responseData = await registerUserService(validatedFields.data);

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

    if ("error" in responseData && responseData.error) {
        return {
            ...prevState,
            formData,
            strapiErrors: responseData.error,
            strapiErrorsDetails:
                responseData.error.details && responseData.error.details.errors
                    ? responseData.error.details.errors
                    : null,
            zodErrors: null,
            message: "Failed to Register.",
        };
    }

    if ("jwt" in responseData) {
        const cookieStore = await cookies();
        cookieStore.set("jwt", responseData.jwt, config);
        cookieStore.set("csrfToken", responseData.csrfToken, config);

        redirect("/");
    }
}

const schemaLogin = z.object({
    identifier: z
        .string()
        .trim()
        .min(1, "This field is required")
        .email("Please enter a valid email address"),
    password: z
        .string()
        .min(8, "Password must be between 8 and 100 characters")
        .max(100, "Password must be between 8 and 100 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/\d/, "Password must contain at least one number")
        .regex(
            /[@$!%*?&#^()\-=+~`'"/|.,;:\[\]{}]/,
            "Password must contain at least one special character (@$!%*?&#^()-=+~`'\"/|.,;:[]{})",
        ),
});

export async function loginUserAction(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prevState: any,
    formData: FormData,
): Promise<ILoginAction | undefined> {
    const validatedFields = schemaLogin.safeParse({
        identifier: formData.get("email"),
        password: formData.get("password"),
    });

    if (!validatedFields.success) {
        return {
            ...prevState,
            formData,
            strapiErrors: null,
            strapiErrorsDetails: null,
            zodErrors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Login.",
        };
    }

    const responseData = await loginUserService(validatedFields.data);

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

    if ("error" in responseData && responseData.error) {
        return {
            ...prevState,
            formData,
            strapiErrors: responseData.error,
            strapiErrorsDetails:
                responseData.error.details && responseData.error.details.errors
                    ? responseData.error.details.errors
                    : null,
            zodErrors: null,
            message: "Failed to Login.",
        };
    }

    if ("jwt" in responseData) {
        const cookieStore = await cookies();
        cookieStore.set("jwt", responseData.jwt, config);
        cookieStore.set("csrfToken", responseData.csrfToken, config);

        redirect("/");
    }
}

export async function logoutAction() {
    const cookieStore = await cookies();

    cookieStore.set("jwt", "", { ...config, maxAge: 0 });
    cookieStore.set("csrfToken", "", { ...config, maxAge: 0 });
}
