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
import { pretty, render, toPlainText } from "react-email";
import VerifyEmail from "@/components/emails/verify-email";
import ResetPasswordEmail from "@/components/emails/reset-password-email";
import SubscriptionActive from "@/components/emails/subscription-verify-email";
import SubscriptionCancelled from "@/components/emails/subscription-cancel-email";
import SubscriptionUpdated from "@/components/emails/subscription-update-email";

dotenv.config();

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
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
      const html = await pretty(await render(<ResetPasswordEmail url={url} />));
      const text = toPlainText(html);

      if (process.env.NODE_ENV !== "production") {
        console.log(text);
      }

      await transporter.sendMail(
        {
          from: '"The Daily Commit" <noreply@thedailycommit.com>',
          to: `${user.name} <${user.email}>`,
          subject: "Reset your password",
          html,
          text,
        },
        function (error, info) {
          if (error) {
            console.error(`Unable to send email.\n\n${error}`);
          } else {
            console.log(`Email sent: ${info.messageId}`);
          }
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
            // could add: description: plan.description, price: plan.price, etc.
          }));
        },
        onSubscriptionComplete: async ({
          event,
          subscription,
          stripeSubscription,
          plan,
        }) => {
          if (subscription.stripeCustomerId) {
            const user = await getUserFromStripeId(
              subscription.stripeCustomerId,
            );
            const newRole = plan.name.toLowerCase();

            if (user.success && user.data) {
              const res = await prisma.user.update({
                where: { id: user.data.id },
                data: { role: newRole },
              });

              const html = await pretty(
                await render(
                  <SubscriptionActive user={user.data} plan={plan} />,
                ),
              );
              const text = toPlainText(html);

              await transporter.sendMail(
                {
                  from: '"The Daily Commit" <noreply@thedailycommit.com>',
                  to: `${user.data.name} <${user.data.email}>`,
                  subject: "Welcome to The Daily Commit",
                  html,
                  text,
                },
                function (error, info) {
                  if (error) {
                    console.error(`Unable to send email.\n\n${error}`);
                  } else {
                    console.log(`Email sent: ${info.messageId}`);
                  }
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
          if (subscription.stripeCustomerId) {
            const user = await getUserFromStripeId(
              subscription.stripeCustomerId,
            );

            if (user.success && user.data) {
              await prisma.user.update({
                where: { id: user.data.id },
                data: { role: "user" }, // downgrade on cancel
              });

              const html = await pretty(
                await render(
                  <SubscriptionCancelled
                    user={user.data}
                    plan={{ name: subscription.plan }}
                  />,
                ),
              );
              const text = toPlainText(html);

              if (process.env.NODE_ENV !== "production") {
                console.log(text);
              }

              await transporter.sendMail(
                {
                  from: '"The Daily Commit" <noreply@thedailycommit.com>',
                  to: `${user.data.name} <${user.data.email}>`,
                  subject: "Cancellation of subscription",
                  html,
                  text,
                },
                function (error, info) {
                  if (error) {
                    console.error(`Unable to send email.\n\n${error}`);
                  } else {
                    console.log(`Email sent: ${info.messageId}`);
                  }
                },
              );
            }
          }
        },
        onSubscriptionUpdate: async ({
          event,
          subscription,
          stripeSubscription,
        }) => {
          if (subscription.stripeCustomerId) {
            const user = await getUserFromStripeId(
              subscription.stripeCustomerId,
            );

            if (user.success && user.data) {
              const newRole = subscription.plan;
              await prisma.user.update({
                where: { id: user.data.id },
                data: { role: newRole },
              });

              const html = await pretty(
                await render(
                  <SubscriptionUpdated
                    user={user.data}
                    planName={subscription.plan}
                    billingInterval={subscription.billingInterval}
                  />,
                ),
              );
              const text = toPlainText(html);

              if (process.env.NODE_ENV !== "production") {
                console.log(text);
              }

              await transporter.sendMail(
                {
                  from: '"The Daily Commit" <noreply@thedailycommit.com>',
                  to: `${user.data.name} <${user.data.email}>`,
                  subject: "Update of your subscription",
                  html,
                  text,
                },
                function (error, info) {
                  if (error) {
                    console.error(`Unable to send email.\n\n${error}`);
                  } else {
                    console.log(`Email sent: ${info.messageId}`);
                  }
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
      const html = await pretty(await render(<VerifyEmail url={url} />));
      const text = toPlainText(html);

      if (process.env.NODE_ENV !== "production") {
        console.log(text);
      }

      await transporter.sendMail(
        {
          from: '"The Daily Commit" <noreply@thedailycommit.com>',
          to: `${user.name} <${user.email}>`,
          subject: "Verify your email",
          html,
          text,
        },
        function (error, info) {
          if (error) {
            console.error(`Unable to send email.\n\n${error}`);
          } else {
            console.log(`Email sent: ${info.messageId}`);
          }
        },
      );
    },
  },
});
