import { UAParser } from "ua-parser-js";
import type { Request } from "express";
import { emailTemplate } from "./emailTemplate.js";
import dotenv from "dotenv";
import { escapeHtml, transporter } from "./email.js";
import type { User } from "../../types/types.js";

dotenv.config({ quiet: true });

const formatLoginTime = (date: Date): string => {
    return `${new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "UTC",
    }).format(date)} UTC`;
};

export const sendLoginNotificationEmail = async (
    user: Pick<User, "id" | "username" | "email">,
    req: Request,
): Promise<void> => {
    const ipAddress = req.ip ?? "Unknown";
    const userAgentRaw = req.headers["user-agent"] ?? "";

    const parser = new UAParser(userAgentRaw);
    const browser = parser.getBrowser();
    const os = parser.getOS();
    const device = parser.getDevice();

    const deviceLabel = device.vendor
        ? `${device.vendor} ${device.model ?? ""}`.trim()
        : device.type
          ? device.type
          : "Desktop";

    const browserLabel = browser.name
        ? `${browser.name} ${browser.version ?? ""}`.trim()
        : "Unknown browser";

    const osLabel = os.name
        ? `${os.name} ${os.version ?? ""}`.trim()
        : "Unknown OS";

    const loginTime = formatLoginTime(new Date());

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "New sign-in to your account",
        html: emailTemplate({
            logo: "cid:app-logo",
            title: "New sign-in detected",
            heading: `Hi, ${escapeHtml(user.username)}!`,
            description: `
                A new sign-in to your account was just detected. If this was you, no action is needed.
                <br /><br />
                <strong>Sign-in details:</strong><br />
                Time: ${loginTime}<br />
                IP address: ${ipAddress}<br />
                Device: ${deviceLabel}<br />
                Browser: ${browserLabel}<br />
                OS: ${osLabel}
            `,
            footer: "If this wasn't you, please change your password immediately and contact support.",
        }),
        attachments: [
            {
                filename: "logo.png",
                path: "./assets/generallogo.png",
                cid: "app-logo",
            },
        ],
    };

    await new Promise<void>((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
                return;
            }

            console.log(`Login notification email sent: ${info.response}`);

            resolve();
        });
    });
};
