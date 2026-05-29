import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { nextCookies } from "better-auth/next-js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { admin } from "better-auth/plugins";

dotenv.config();

export const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
        user: "nikki.leuschke@ethereal.email",
        pass: "NWXrggTFV1VkSHmYhd",
    },
    secure: true,
});

const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

export const auth = betterAuth({
    database: prismaAdapter(prisma, { provider: "postgresql" }),
    user: {
        changeEmail: {
            enabled: true,
        },
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        requireEmailVerification: true,
        resetPasswordTokenExpiresIn: 60 * 30,
        sendResetPassword: async ({ user, url }) => {
            const text = `Click the link to change your password: ${url}`;
            console.log(text);
            await transporter.sendMail(
                {
                    from: '"Fakenews" <noreply@fakenews.com>',
                    to: user.email,
                    subject: "Reset your password",
                    text: text,
                },
                function (error, info) {
                    console.error(`Unable to send email.\n\n${error}\n${info}`);
                },
            );
        },
    },
    plugins: [nextCookies(), admin()],
    emailVerification: {
        autoSignInAfterVerification: true,
        sendOnSignUp: true,
        sendVerificationEmail: async ({ user, url }) => {
            const text = `Click the link to verify your email address: ${url}`;
            console.log(text);
            await transporter.sendMail(
                {
                    from: '"Fakenews" <noreply@fakenews.com>',
                    to: user.email,
                    subject: "Verify your email",
                    text: text,
                },
                function (error, info) {
                    console.error(`Unable to send email.\n\n${error} ${info}`);
                },
            );
        },
    },
});
