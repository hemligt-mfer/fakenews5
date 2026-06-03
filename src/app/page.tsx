import { getArticles, getEditorsChoiceArticles, getMostPopularArticles } from "@/_actions/article-actions";
import HeroCard from "@/components/hero-card";
import NewsCard from "@/components/news-card";
import SectionHead from "@/components/section-head";
import SidebarCard from "@/components/sidebar-card";

export default async function HomePage() {
    const [allResult, editorsResult, popularResult] = await Promise.all([
        getArticles(),
        getEditorsChoiceArticles(),
        getMostPopularArticles(3),
    ]);

    const allArticles    = allResult.success    ? allResult.data    : [];
    const editorsPicks   = editorsResult.success ? editorsResult.data : [];
    const mostPopular    = popularResult.success ? popularResult.data : [];

    const heroArticle  = editorsPicks[0] ?? null;
    const latestNews   = allArticles.filter((a) => !a.editorsChoice);

    // Sidebar: remaining editor's picks first, then fill with latest news
    const sidebarArticles = [
        ...editorsPicks.slice(1),
        ...latestNews,
    ].slice(0, 4);

    return (
        <div className="flex flex-col w-full p-4 lg:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">

                {/* ── MAIN COLUMN ── */}
                <main className="flex flex-col min-w-0">

                    {/* Hero — Editor's Choice */}
                    {heroArticle && (
                        <section className="mb-2">
                            <HeroCard
                                id={heroArticle.id}
                                title={heroArticle.title}
                                summary={heroArticle.summary}
                                image={heroArticle.image}
                                category={heroArticle.category}
                                author={heroArticle.author}
                                createdAt={heroArticle.createdAt}
                            />
                        </section>
                    )}

                    {/* Latest News */}
                    <section>
                        <SectionHead title="Latest News" />
                        {latestNews.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No articles published yet.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {latestNews.map((article) => (
                                    <NewsCard
                                        key={article.id}
                                        id={article.id}
                                        title={article.title}
                                        summary={article.summary}
                                        location={article.location}
                                        author={article.author}
                                        category={article.category}
                                        image={article.image}
                                        createdAt={article.createdAt}
                                        updatedAt={article.updatedAt}
                                        size="medium"
                                    />
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Most Popular */}
                    {mostPopular.length > 0 && (
                        <section>
                            <SectionHead title="Most Popular" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {mostPopular.map((article) => (
                                    <NewsCard
                                        key={article.id}
                                        id={article.id}
                                        title={article.title}
                                        summary={article.summary}
                                        location={article.location}
                                        author={article.author}
                                        category={article.category}
                                        image={article.image}
                                        createdAt={article.createdAt}
                                        updatedAt={article.updatedAt}
                                        size="text"
                                    />
                                ))}
                            </div>
                        </section>
                    )}
                </main>

                {/* ── RIGHT SIDEBAR ── */}
                <aside className="flex flex-col gap-0">

                    {/* Stacked article cards */}
                    {sidebarArticles.length > 0 && (
                        <div className="flex flex-col gap-5 mb-6">
                            {sidebarArticles.map((article) => (
                                <SidebarCard
                                    key={article.id}
                                    id={article.id}
                                    title={article.title}
                                    image={article.image}
                                    category={article.category}
                                    author={article.author}
                                    createdAt={article.createdAt}
                                />
                            ))}
                        </div>
                    )}

                    {/* Weather widget — placeholder until API is connected */}
                    <div className="border border-border p-4 mb-4">
                        <p className="font-sans text-[11px] font-bold uppercase tracking-[0.1em] text-foreground mb-3">
                            Weather <span className="text-muted-foreground font-normal normal-case tracking-normal">[API]</span>
                        </p>
                        <p className="text-sm text-muted-foreground">Weather data coming soon.</p>
                    </div>

                    {/* Markets widget — placeholder until API is connected */}
                    <div className="border border-border p-4">
                        <p className="font-sans text-[11px] font-bold uppercase tracking-[0.1em] text-foreground mb-3">
                            Markets <span className="text-muted-foreground font-normal normal-case tracking-normal">[API]</span>
                        </p>
                        <p className="text-sm text-muted-foreground">Market data coming soon.</p>
                    </div>

                </aside>
            </div>
        </div>
    );
}
