import ArticleList from "@/components/article-list";
import prisma from "@/lib/prisma";

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { search } = await searchParams;

    const where =
        typeof search === "string" && search.trim()
            ? {
                  deleted: null,
                  OR: [
                      { title: { contains: search, mode: "insensitive" as const } },
                      {
                          author: {
                              some: {
                                  alias: { contains: search, mode: "insensitive" as const },
                              },
                          },
                      },
                      {
                          category: {
                              some: {
                                  name: { contains: search, mode: "insensitive" as const },
                              },
                          },
                      },
                  ],
              }
            : { deleted: null };

    const articles = await prisma.article.findMany({
        where,
        select: {
            id: true,
            title: true,
            summary: true,
            content: true,
            bookmark: { include: { user: { select: { comments: true } } } },
            image: true,
            location: true,
            createdAt: true,
            updatedAt: true,
            category: { select: { id: true, name: true } },
            author: { select: { id: true, alias: true, userId: true } },
            comments: { include: { reactions: true } },
            views: true,
            reactions: true,
            editorsChoice: true,
            deleted: true,
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <main className="max-w-5xl mx-auto px-4 py-8">
            {search && (
                <p className="text-sm mb-6">
                    {articles.length} result{articles.length !== 1 ? "s" : ""} for &quot;
                    {search}&quot;
                </p>
            )}

            {articles.length === 0 && search && (
                <p className="">
                    No articles matched your search. Try a different title, author, or category.
                </p>
            )}

            <ArticleList articles={articles} articlesPerPage={10} />
        </main>
    );
}
