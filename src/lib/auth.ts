import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { nextCookies } from "better-auth/next-js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { admin as adminPlugin } from "better-auth/plugins";
import { editor, admin, ac, user, basic, pro } from "./permissions";
import Stripe from "stripe";
import { stripe } from "@better-auth/stripe";
import { getUserFromStripeId } from "@/_actions/user-actions";

dotenv.config();

export const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
        user: "nikki.leuschke@ethereal.email",
        pass: "NWXrggTFV1VkSHmYhd",
    },
});

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-05-27.dahlia", // Latest API version as of Stripe SDK v22.0.0
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
                    from: '"The Daily Commit" <noreply@thedailycommit.com>',
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
    plugins: [
        adminPlugin({ ac, roles: { admin, editor, user, basic, pro } }),
        stripe({
            stripeClient,
            stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
            subscription: {
                enabled: true,
                plans: async () => {
                    const plans = await prisma.plan.findMany();
                    return plans.map((plan) => ({
                        name: plan.name,
                        priceId: plan.priceId,
                        annualDiscountPriceId:
                            plan.annualPriceId !== null ? plan.annualPriceId : undefined,
                    }));
                },
                onSubscriptionComplete: async ({
                    event,
                    subscription,
                    stripeSubscription,
                    plan,
                }) => {
                    const text = `Thank your for signing up to our ${plan.name} plan. Go to http://localhost:3000/dashboard/profile/sub to manage your subscription.`;
                  
                    if (subscription.stripeCustomerId) {
                        const user = await getUserFromStripeId(subscription.stripeCustomerId);
                        const newRole = plan.name.toLowerCase();
                        // console.log(user, newRole);

                        if (user.success && user.data) {
                            const res = await prisma.user.update({
                                where: { id: user.data.id },
                                data: { role: newRole },
                            });
                            await transporter.sendMail(
                                {
                                    from: '"The Daily Commit" <noreply@thedailycommit.com>',
                                    to: user.data.email,
                                    subject: "Welcome to The Daily Commit",
                                    text: text,
                                },
                                function (error, info) {
                                    console.error(`Unable to send email.\n\n${error}\n${info}`);
                                },
                            );
                        }
                    }
                },
                onSubscriptionCancel: async ({
                    event,
                    subscription,
                    stripeSubscription,
                    cancellationDetails,
                }) => {
                    const text = `We're sorry to se you go! Your subscription has been cancelled. Go to http://localhost:3000/dashboard/profile/sub to restore and/or manage your subscriptions.`;
                
                    if (subscription.stripeCustomerId) {
                        const user = await getUserFromStripeId(subscription.stripeCustomerId);
                        if (user.success && user.data) {
                            await prisma.user.update({
                                where: { id: user.data.id },
                                data: { role: "user" }, // downgrade on cancel
                            });
                            await transporter.sendMail(
                                {
                                    from: '"The Daily Commit" <noreply@thedailycommit.com>',
                                    to: user.data.email,
                                    subject: "Cancellation of subscription",
                                    text: text,
                                },
                                function (error, info) {
                                    console.error(`Unable to send email.\n\n${error}\n${info}`);
                                },
                            );
                        }
                    }
                },
                onSubscriptionUpdate: async ({ event, subscription, stripeSubscription }) => {
                    const text = `Your subscription has been updated to ${subscription.plan}. You will be billed ${subscription.billingInterval == "year" ? "yearly" : "monthly"}.`;
                    console.log(text);
                    if (subscription.stripeCustomerId) {
                        const user = await getUserFromStripeId(subscription.stripeCustomerId);
                        if (user.success && user.data) {
                            const newRole = subscription.plan;
                            await prisma.user.update({
                                where: { id: user.data.id },
                                data: { role: newRole },
                            });
                            await transporter.sendMail(
                                {
                                    from: '"The Daily Commit" <noreply@thedailycommit.com>',
                                    to: user.data.email,
                                    subject: "Update of your subscription",
                                    text: text,
                                },
                                function (error, info) {
                                    console.error(`Unable to send email.\n\n${error}\n${info}`);
                                },
                            );
                        }
                    }
                },
            },
        }),
        nextCookies(),
    ],
    emailVerification: {
        autoSignInAfterVerification: true,
        sendOnSignUp: true,
        sendVerificationEmail: async ({ user, url }) => {
            const text = `Click the link to verify your email address: ${url}`;
            console.log(text);
            await transporter.sendMail(
                {
                    from: '"The Daily Commit" <noreply@thedailycommit.com>',
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
