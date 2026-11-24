import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

export const transporter = process.env.EMAIL_HOST
    ? nodemailer.createTransport({
          host: process.env.EMAIL_HOST,
          port: Number(process.env.EMAIL_PORT) || 587,
          secure: process.env.EMAIL_SECURE === "true",
          auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASSWORD,
          },
      })
    : nodemailer.createTransport({
          service: process.env.EMAIL_SERVICE,
          auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASSWORD,
          },
      });

export const escapeHtml = (value: string) => {
    return value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);
};
