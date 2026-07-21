import RouteHeading from "@/components/route-heading";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { Analytics, AnalyticsPaywall, EditorAnalytics } from "./_components/analytics";

// Roles that can see the personal analytics dashboard (bookmark breakdown,
// comment activity, full comment history). Kept local to this file since
// access-control.tsx is off-limits — update this set if the role list changes.
const SUBSCRIBER_ROLES = new Set(["pro", "admin"]);

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;
  if (!userId) notFound();

  const userInfo = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      user_info: {
        select: {
          bookmark: { select: { article: { select: { category: true } } } },
          comments: {
            select: {
              id: true,
              content: true,
              createdAt: true,
              article: { select: { title: true } },
            },
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  });

  if (!userInfo) notFound();

  const isEditor = userInfo.role === "editor";
  const isSubscriber = !!userInfo.role && SUBSCRIBER_ROLES.has(userInfo.role);

  // ---- bookmark distribution by category ----
  const map = new Map<string, number>();
  userInfo.user_info?.bookmark.forEach((bookmark) => {
    bookmark.article.category.forEach((cat) => {
      map.set(cat.name, (map.get(cat.name) || 0) + 1);
    });
  });
  const data = Array.from(map, ([category, bookmarks]) => ({
    category,
    bookmarks,
  }));

  // ---- comment activity over time (last 12 months) ----
  const now = new Date();
  const activityMap = new Map<string, number>();
  // seed the last 12 months at 0 so empty months still show on the axis
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    });
    activityMap.set(key, 0);
  }
  userInfo.user_info?.comments.forEach((c) => {
    const key = c.createdAt.toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    });
    if (activityMap.has(key)) activityMap.set(key, activityMap.get(key)! + 1);
  });
  const commentActivity = Array.from(activityMap, ([month, comments]) => ({
    month,
    comments,
  }));

  // ---- the subscriber's own comments, most recent first ----
  const myComments =
    userInfo.user_info?.comments.map((c) => ({
      id: c.id,
      content: c.content,
      article: c.article?.title ?? "—",
      date: c.createdAt.toLocaleDateString(),
      // matches the "MMM yy" key used to build commentActivity, so a bar
      // click (which carries that same string) can filter this list
      monthKey: c.createdAt.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      }),
    })) ?? [];

  // ---------------- EDITOR ----------------
  let editorView: React.ComponentProps<typeof EditorAnalytics> | null = null;
  if (isEditor) {
    const [
      userCount,
      articleCount,
      commentCount,
      editorsChoiceCount,
      topArticlesRaw,
      recentCommentsRaw,
      authorsRaw,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.article.count({ where: { deleted: null } }),
      prisma.comment.count(),
      prisma.article.count({ where: { editorsChoice: true, deleted: null } }),
      prisma.article.findMany({
        where: { deleted: null },
        orderBy: { views: "desc" },
        take: 8,
        select: {
          id: true,
          title: true,
          editorsChoice: true,
          views: true,
          _count: {
            select: {
              reactions: true,
              bookmark: true,
              comments: true,
            },
          },
          author: { select: { alias: true } },
        },
      }),
      prisma.comment.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          content: true,
          createdAt: true,
          article: { select: { title: true } },
          user: { select: { user: { select: { name: true } } } },
        },
      }),
      prisma.author.findMany({
        select: {
          alias: true,
          articles: {
            where: { deleted: null },
            select: { views: true },
          },
        },
      }),
    ]);

    editorView = {
      userCount,
      articleCount,
      commentCount,
      editorsChoiceCount,
      topArticles: topArticlesRaw.map((a) => ({
        id: a.id,
        title: a.title,
        views: a.views,
        reactions: a._count.reactions,
        bookmarks: a._count.bookmark,
        comments: a._count.comments,
        editorsChoice: a.editorsChoice,
        author: a.author.map((au) => au.alias).join(", ") || "—",
      })),
      recentComments: recentCommentsRaw.map((c) => ({
        id: c.id,
        content: c.content,
        author: c.user?.user?.name ?? "Unknown",
        article: c.article?.title ?? "—",
        date: c.createdAt.toLocaleDateString(),
      })),
      topAuthors: authorsRaw
        .map((a) => ({
          alias: a.alias,
          views: a.articles.reduce((s, x) => s + x.views, 0),
          articles: a.articles.length,
        }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 5),
    };
  }

  return (
    <div suppressContentEditableWarning suppressHydrationWarning>
      <RouteHeading label="Analytics" />
      <div className="pt-10 space-y-8">
        {isEditor && editorView ? (
          <EditorAnalytics {...editorView} />
        ) : isSubscriber ? (
          <Analytics
            data={data}
            commentActivity={commentActivity}
            comments={myComments}
          />
        ) : (
          <AnalyticsPaywall />
        )}
      </div>
    </div>
  );
}