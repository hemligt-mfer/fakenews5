import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { format, formatDistanceToNow } from "date-fns";
import {
  getArticlesForWebsite,
  getAuthors,
  getEditorsChoiceArticles,
  getMostPopularArticles,
} from "@/_actions/article-actions";
import NewsCard from "@/components/news-card";
import SectionHead from "@/components/section-head";
import SidebarCard from "@/components/sidebar-card";
import NewsSidebar from "@/components/news-sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getSubscriptionPlanFromUserId } from "@/_actions/subscription-actions";
import { getConsent } from "@/lib/cookie-actions";
import NewsletterForm from "@/components/newsletter/newsletter-form";
import { getCategories } from "@/_actions/category-actions";

export default async function HomePage() {
  const [allResult, editorsResult, popularResult] = await Promise.all([
    getArticlesForWebsite(),
    getEditorsChoiceArticles(),
    getMostPopularArticles(5),
  ]);

  const allArticles = allResult.success ? allResult.data : [];
  const editorsPicks = editorsResult.success ? editorsResult.data : [];
  const mostPopular = popularResult.success ? popularResult.data : [];

  const hero = editorsPicks[0] ?? null;
  const latestNews = allArticles.filter((a) => !a.editorsChoice).slice(0, 6);
  const popularGrid = mostPopular.filter((a) => a.id !== hero?.id).slice(0, 3);
  const mostRead = mostPopular
    .slice(0, 5)
    .map((a) => ({ id: a.id, title: a.title }));

  // Right column: remaining editor's picks first, then fill with latest news — always 3 cards
  const rightColumn = [...editorsPicks.slice(1), ...latestNews]
    .filter((a) => a.id !== hero?.id)
    .slice(0, 3);

  const user = await auth.api.getSession({ headers: await headers() });
  if (user) {
    const plan = await getSubscriptionPlanFromUserId(user.user.id);
    //console.log(plan);
  }

  const consent = await getConsent();
  console.log(consent);

  const cats = await getCategories();
  const auths = await getAuthors();
  const categories = [];
  const authors = [];

  if (cats.success && cats.data) {
    for (const c of cats.data) {
      categories.push(c.name);
    }
  }
  if (auths.success && auths.data) {
    for (const a of auths.data) {
      authors.push(a.alias);
    }
  }

  return (
    <div className="w-full px-5 pb-10">
      <NewsletterForm categories={categories} authors={authors} />
      {/* ── Hero section ── */}
      <div className="flex items-center gap-3 mt-6 mb-4">
        <div className="flex-1 border-t border-border" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_260px] gap-0 mb-6">
        {/* Main hero */}
        <div className="pr-0 md:pr-6">
          {hero ? (
            <Link href={`/article/${hero.id}`} className="group block">
              <div className="relative w-full aspect-video mb-2.5 overflow-hidden bg-muted border border-border">
                {hero.image ? (
                  <Image
                    src={hero.image}
                    alt={hero.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 700px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-sans text-[12px] text-muted-foreground">
                      FEATURED IMAGE
                    </span>
                  </div>
                )}
              </div>
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.08em] text-primary mb-1">
                {hero.category[0]?.name ?? "Editor's Choice"}
              </p>
              <h1 className="font-serif text-[22px] md:text-[28px] font-bold leading-tight text-foreground group-hover:text-primary transition-colors mb-2">
                {hero.title}
              </h1>
              <p className="font-sans text-[14px] text-muted-foreground">
                {hero.summary}
              </p>
              <p className="font-sans text-[11px] text-muted-foreground mt-2">
                {hero.author.length > 0 &&
                  `By ${hero.author.map((a) => a.alias).join(", ")} · `}
                {formatDistanceToNow(hero.createdAt, { addSuffix: true })}
              </p>
            </Link>
          ) : (
            <p className="text-muted-foreground text-sm">
              No editor&apos;s choice set yet.
            </p>
          )}
        </div>

        {/* Vertical rule — desktop only */}
        <div className="hidden md:block bg-border mx-6" />

        {/* Right column — always 3 articles */}
        {rightColumn.length > 0 && (
          <div className="flex flex-col mt-6 md:mt-0 border-t md:border-t-0 border-border pt-5 md:pt-0">
            {rightColumn.map((a) => (
              <SidebarCard
                key={a.id}
                id={a.id}
                title={a.title}
                image={a.image}
                category={a.category}
                author={a.author}
                createdAt={a.createdAt}
              />
            ))}
          </div>
        )}
      </div>

      <Separator className="mb-6" />

      {/* ── Latest News + Sidebar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        <div>
          <SectionHead title="Latest News" />
          <div className="divide-y divide-border">
            {latestNews.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">
                No articles published yet.
              </p>
            ) : (
              latestNews.map((a) => (
                <div key={a.id} className="py-6 first:pt-0">
                  <NewsCard
                    id={a.id}
                    title={a.title}
                    summary={a.summary}
                    location={a.location}
                    author={a.author}
                    category={a.category}
                    image={a.image}
                    createdAt={a.createdAt}
                    updatedAt={a.updatedAt}
                    size="hero"
                  />
                </div>
              ))
            )}
          </div>

          {/* Most Popular */}
          {popularGrid.length > 0 && (
            <>
              <SectionHead title="Most Popular" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-0">
                {popularGrid.map((a, i) => (
                  <div
                    key={a.id}
                    className={`px-0 sm:px-5 first:pl-0 last:pr-0 py-4 sm:py-0 border-b border-border sm:border-b-0 last:border-b-0 ${i < popularGrid.length - 1 ? "md:border-r md:border-border" : ""}`}
                  >
                    <NewsCard
                      id={a.id}
                      title={a.title}
                      summary={a.summary}
                      location={a.location}
                      author={a.author}
                      category={a.category}
                      image={a.image}
                      createdAt={a.createdAt}
                      updatedAt={a.updatedAt}
                      size="text"
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <NewsSidebar mostRead={mostRead} />
      </div>
    </div>
  );
}
