// Get the full source code, including the theme and Tailwind config:
// https://github.com/resend/react-email/tree/canary/apps/demo/emails

import {
  Body,
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

export interface NewsletterArticle {
  id: string;
  title: string;
  summary: string;
}

export interface NewsletterCategorySection {
  name: string;
  articles: NewsletterArticle[];
}

export interface NewsletterAuthorSection {
  alias: string;
  articles: NewsletterArticle[];
}

export interface WeeklyNewsletterProps {
  dateLabel: string;
  categories: NewsletterCategorySection[];
  authors: NewsletterAuthorSection[];
  mostViewed: NewsletterArticle[];
  mostReactions: NewsletterArticle[];
}

// Renders each article like a newspaper story: serif headline, a thin rule,
// then a dek (summary) in smaller body text. The last item in a list drops
// its rule so the section doesn't end on a stray line.
const ArticleList = ({ articles }: { articles: NewsletterArticle[] }) => (
  <>
    {articles.map((a, i) => (
      <div
        key={a.id}
        className={
          i < articles.length - 1
            ? "border-b border-border pb-4 mb-4"
            : ""
        }
      >
        <Link
          href={`${baseUrl}/article/${a.id}`}
          className="no-underline text-card-foreground"
        >
          <Text className="font-serif font-bold text-[17px] leading-snug m-0">
            {a.title}
          </Text>
        </Link>
        <Text className="font-serif text-[13px] leading-relaxed text-muted-foreground italic m-0 mt-1.5">
          {a.summary}
        </Text>
      </div>
    ))}
  </>
);

export const WeeklyNewsletter = ({
  dateLabel,
  categories,
  authors,
  mostViewed,
  mostReactions,
}: WeeklyNewsletterProps) => (
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
        <Preview>Your Daily Commit newsletter for {dateLabel}</Preview>
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
                <div className="flex items-center justify-center gap-3 mt-6">
                  <div className="flex-1 h-px bg-border"></div>
                  <Text className="text-[10px] font-sans tracking-widest uppercase text-muted-foreground m-0 whitespace-nowrap">
                    Weekly Edition &middot; {dateLabel}
                  </Text>
                  <div className="flex-1 h-px bg-border"></div>
                </div>
              </Section>

              <Section className="mobile:px-6! px-10 pt-2">
                <Text className="font-serif text-[32px] md:text-[30px] text-card-foreground m-0 font-bold leading-tight">
                  Your weekly digest
                </Text>
                <Text className="text-[14px] font-sans text-muted-foreground m-0 mt-1.5">
                  Here&apos;s what happened the week of {dateLabel}.
                </Text>
              </Section>

              {/* Subscribed categories */}
              {categories.length > 0 && (
                <Section className="mobile:px-6! px-10 pt-8">
                  <Text className="text-[12px] font-sans font-bold uppercase tracking-widest text-primary border-b-2 border-primary pb-2 m-0">
                    From your categories
                  </Text>
                  {categories.map((c) => (
                    <Section key={c.name} className="mt-5">
                      <Text className="text-[11px] font-sans font-bold uppercase tracking-widest text-muted-foreground m-0 mb-2">
                        {c.name}
                      </Text>
                      <ArticleList articles={c.articles} />
                    </Section>
                  ))}
                </Section>
              )}

              {/* Subscribed authors */}
              {authors.length > 0 && (
                <Section className="mobile:px-6! px-10 pt-8">
                  <Text className="text-[12px] font-sans font-bold uppercase tracking-widest text-primary border-b-2 border-primary pb-2 m-0">
                    From authors you follow
                  </Text>
                  {authors.map((a) => (
                    <Section key={a.alias} className="mt-5">
                      <Text className="text-[11px] font-sans font-bold uppercase tracking-widest text-muted-foreground m-0 mb-2">
                        {a.alias}
                      </Text>
                      <ArticleList articles={a.articles} />
                    </Section>
                  ))}
                </Section>
              )}

              {/* Most viewed */}
              {mostViewed.length > 0 && (
                <Section className="mobile:px-6! px-10 pt-8">
                  <Text className="text-[12px] font-sans font-bold uppercase tracking-widest text-primary border-b-2 border-primary pb-2 m-0">
                    Most viewed this week
                  </Text>
                  <Section className="mt-5">
                    <ArticleList articles={mostViewed} />
                  </Section>
                </Section>
              )}

              {/* Most reactions */}
              {mostReactions.length > 0 && (
                <Section className="mobile:px-6! px-10 pt-8 pb-8">
                  <Text className="text-[12px] font-sans font-bold uppercase tracking-widest text-primary border-b-2 border-primary pb-2 m-0">
                    Most talked about
                  </Text>
                  <Section className="mt-5">
                    <ArticleList articles={mostReactions} />
                  </Section>
                </Section>
              )}

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

export default WeeklyNewsletter;

WeeklyNewsletter.PreviewProps = {
  dateLabel: "24/06 - 01/07",
  categories: [
    {
      name: "Peters stuga",
      articles: [
        { id: "1", title: "Myrorna anfaller", summary: "Myrorna anfaller Myrorna anfaller Myrorna anfaller" },
        { id: "2", title: "Killed a squirrel with lawnmover", summary: "Myrorna anfaller Myrorna anfaller Myrorna anfaller" },
      ],
    },
  ],
  authors: [
    {
      alias: "Peter Lantjannesson",
      articles: [{ id: "3", title: "Why I switched to sewer water", summary: "Myrorna anfaller Myrorna anfaller Myrorna anfaller"}],
    },
  ],
  mostViewed: [{ id: "4", title: "Breaking: Man from Norrköping hoppade framför gräsklippare", summary: "Myrorna anfaller Myrorna anfaller Myrorna anfaller"}],
  mostReactions: [{ id: "5", title: "Hot take of the week", summary: "Myrorna anfaller Myrorna anfaller Myrorna anfaller" }],
} satisfies WeeklyNewsletterProps;