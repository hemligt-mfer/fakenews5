import RouteHeading from "@/components/route-heading";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import ArticleList from "@/components/article-list";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  const savedArticles = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      user_info: {
        select: {
          bookmark: {
            select: {
              user: { select: { comments: true } },
              user_id: true,
              articleId: true,
              article: {
                select: {
                  id: true,
                  title: true,
                  summary: true,
                  content: true,
                  bookmark: {
                    include: { user: { select: { comments: true } } },
                  },
                  image: true,
                  location: true,
                  createdAt: true,
                  updatedAt: true,
                  category: { select: { id: true, name: true, parentId: true } },
                  author: { select: { id: true, alias: true, userId: true } },
                  comments: { include: { reactions: true } },
                  views: true,
                  reactions: true,
                  editorsChoice: true,
                  deleted: true,
                },
              },
            },
          },
        },
      },
    },
  });

  let articles = savedArticles?.user_info?.bookmark.map((a) => a.article) ?? [];

  // Filter by category if provided (Next already decoded the query param)
  if (category) {
    const categoryFilter = category.trim().toLowerCase();
    articles = articles.filter((article) =>
      article.category.some((cat) => cat.name.toLowerCase() === categoryFilter)
    );
  }

  return (
    <div className="mb-5">
      <RouteHeading label="Saved Articles" />
      {category && (
        <p className="mt-2 text-sm text-muted-foreground">
          Filtered by: <strong>{category}</strong>
        </p>
      )}
      <div className="mt-5">
        <ArticleList articles={articles} articlesPerPage={5} />
      </div>
    </div>
  );
}