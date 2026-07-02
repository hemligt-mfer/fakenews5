// Get the full source code, including the theme and Tailwind config:
// https://github.com/resend/react-email/tree/canary/apps/demo/emails

import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
  pixelBasedPreset,
} from "react-email";
import { emailDarkColors, emailRootColors } from "./_themes/theme";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

interface SubscriptionUpdatedUser {
  name: string;
  email: string;
}

interface SubscriptionUpdatedProps {
  user: SubscriptionUpdatedUser;
  planName: string;
  billingInterval: "day" | "week" | "month" | "year" | undefined;
}

export const SubscriptionUpdated = ({
  user,
  planName,
  billingInterval,
}: SubscriptionUpdatedProps) => (
  <Tailwind
    config={{
      presets: [pixelBasedPreset],
      theme: {
        extend: {
          colors: {
            ...emailRootColors,
            ...emailDarkColors,
          },
          fontFamily: {
            sans: ["Inter", "Helvetica", "Arial", "sans-serif"],
            serif: ["Georgia", "Times New Roman", "serif"],
          },
        },
      },
    }}
  >
    <Html>
      <Head>
        <Preview>Your subscription has been updated</Preview>
      </Head>

      <Body className="bg-background text-[14px] font-sans text-foreground m-0 p-0">
        <Container className="mx-auto max-w-160 px-4 pt-16 pb-6">
          <Section className="shadow-md rounded-1xl">
            <Section className="bg-card border-border rounded-1xl border">
              {/* Masthead */}
              <Section className="mobile:px-6! px-10 py-10">
                <div className="flex justify-center mx-auto">
                  <div className="my-auto w-full max-w-32 md:max-w-80 pt-2">
                    <h1 className="font-serif font-bold text-[10px] md:text-2xl text-center leading-tight tracking-tight whitespace-nowrap">
                     The Daily Commit
                    </h1>
                    <div className="border-b md:border-b-2 border-primary mt-0.5 md:mt-1"></div>
                    <p className="text-center text-[5px] md:text-[10px] tracking-tighter md:tracking-wide mt-0.5 md:mt-2 leading-tight">
                      YOUR DAILY DOSE OF NEWS.{" "}
                      <span className="text-primary font-bold">COMMITTED</span>{" "}
                      TO THE TRUTH.
                    </p>
                  </div>
                </div>
              </Section>

              <Section className="mobile:px-6! px-10 pt-8">
                <Section className="mb-9">
                  <Text className="text-[32px] md:text-[30px] text-card-foreground m-0 font-sans font-bold">
                    Your plan has been updated
                  </Text>

                  <Text className="text-[14px] font-sans text-muted-foreground m-0 mt-4.5">
                    Hi {user.name}, your subscription has been updated to the{" "}
                    {planName} plan.
                  </Text>

                  <Text className="text-[14px] font-sans text-muted-foreground m-0 mt-4.5">
                    You will be billed{" "}
                    {billingInterval === "year"
                      ? "yearly"
                      : billingInterval === "month"
                        ? "monthly"
                        : billingInterval === "week"
                          ? "weekly"
                          : billingInterval === "day"
                            ? "daily"
                            : "on your regular billing cycle"}
                    .
                  </Text>

                  <Text className="text-[14px] font-sans text-muted-foreground m-0 mt-4.5">
                    You can manage your subscription, update billing, or switch
                    plans at any time from your account settings.
                  </Text>
                </Section>

                <Button
                  href={`${baseUrl}/dashboard/profile/sub`}
                  className="bg-primary text-[15px] font-sans text-primary-foreground inline-block rounded-[6px] border-none px-5 py-3.5 text-center"
                >
                  Manage Subscription
                </Button>
              </Section>

              <Section className="mobile:px-6! px-10 pt-16 pb-8">
                <Text className="text-[11px] font-sans text-muted-foreground m-0 max-w-77.5">
                  If you didn&apos;t make this change, please contact our
                  support team right away.
                </Text>
              </Section>

              {/* Footer */}
              <Section className="border-border border-t px-10 py-16">
                <Text className="text-[13px] font-sans text-muted-foreground m-0 max-w-[320px]">
                  YOUR DAILY DOSE OF NEWS. COMMITTED TO THE TRUTH.
                </Text>

                <Row align="left">
                  <Column className="w-full pt-8 align-top">
                    <Text className="text-[11px] font-sans text-muted-foreground m-0">
                      Nyhetsgatan 5
                      <br />
                      58227 Linköping, Sweden
                    </Text>
                  </Column>
                </Row>
              </Section>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  </Tailwind>
);

export default SubscriptionUpdated;

SubscriptionUpdated.PreviewProps = {
  user: {
    name: "Adam Lundvall",
    email: "adam@example.com",
  },
  planName: "Pro",
  billingInterval: "month",
} satisfies SubscriptionUpdatedProps;
