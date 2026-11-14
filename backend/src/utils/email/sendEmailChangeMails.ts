import { ApiError } from "../apiError.js";
import { escapeHtml, transporter } from "./email.js";
import { emailTemplate } from "./emailTemplate.js";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

export const sendEmailChangeMails = async (
    user: { username: string; email: string },
    newEmail: string,
    token: string,
) => {
    const attachments = [
        {
            filename: "logo.png",
            path: "./assets/generallogo.png",
            cid: "app-logo",
        },
    ];

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: newEmail,
            subject: "Confirm your new email address",
            html: emailTemplate({
                logo: "cid:app-logo",
                title: "Confirm your new email",
                heading: "Confirm your new email address",
                description: `Hello <strong>${escapeHtml(user.username)}</strong>, please confirm that you want to use this address for your account.`,
                buttonText: "Confirm Email",
                buttonUrl: `${process.env.FRONTEND_URL}/verifyEmail?token=${token}`,
                footer: "This link expires in 24 hours. If you didn't request this change, you can ignore this email.",
            }),
            attachments,
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Your email address is being changed",
            html: emailTemplate({
                logo: "cid:app-logo",
                title: "Email change requested",
                heading: "Email change requested",
                description: `Hello <strong>${escapeHtml(user.username)}</strong>, we received a request to change the email address of your account to <strong>${escapeHtml(newEmail)}</strong>. The change takes effect only after it is confirmed from the new address.`,
                footer: "If you didn't request this, change your password right away: this cancels the pending change.",
            }),
            attachments,
        });
    } catch {
        throw new ApiError({
            statusCode: 503,
            message:
                "Email delivery is temporarily unavailable. Please try again.",
        });
    }
};
