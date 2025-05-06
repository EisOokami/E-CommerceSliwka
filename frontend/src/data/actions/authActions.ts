"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { registerUserService, loginUserService } from "../services/authService";

const config = {
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    domain: process.env.HOST ?? "localhost",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
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
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function registerUserAction(prevState: any, formData: FormData) {
    const validatedFields = schemaRegister.safeParse({
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!validatedFields.success) {
        return {
            ...prevState,
            zodErrors: validatedFields.error.flatten().fieldErrors,
            strapiErrors: null,
            message: "Missing Fields. Failed to Register.",
        };
    }

    const responseData = await registerUserService(validatedFields.data);

    if (!responseData) {
        return {
            ...prevState,
            strapiErrors: null,
            zodErrors: null,
            message: "Ops! Something went wrong. Please try again.",
        };
    }

    if (responseData.error) {
        return {
            ...prevState,
            strapiErrors: responseData.error,
            zodErrors: null,
            message: "Failed to Register.",
        };
    }

    const cookieStore = await cookies();
    cookieStore.set("jwt", responseData.jwt, config);

    redirect("/");
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function loginUserAction(prevState: any, formData: FormData) {
    const validatedFields = schemaLogin.safeParse({
        identifier: formData.get("email"),
        password: formData.get("password"),
    });

    if (!validatedFields.success) {
        return {
            ...prevState,
            zodErrors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Login.",
        };
    }

    const responseData = await loginUserService(validatedFields.data);

    if (!responseData) {
        return {
            ...prevState,
            strapiErrors: responseData.error,
            zodErrors: null,
            message: "Ops! Something went wrong. Please try again.",
        };
    }

    if (responseData.error) {
        return {
            ...prevState,
            strapiErrors: responseData.error,
            zodErrors: null,
            message: "Failed to Login.",
        };
    }

    const cookieStore = await cookies();
    cookieStore.set("jwt", responseData.jwt, config);

    redirect("/");
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.set("jwt", "", { ...config, maxAge: 0 });
    redirect("/");
}
