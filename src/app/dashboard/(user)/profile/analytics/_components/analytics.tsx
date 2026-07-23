"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  type TooltipContentProps,
} from "recharts";
import { useRouter } from "next/navigation";
import { Lock, MessageSquare, TrendingUp, TrendingDown, Minus, X } from "lucide-react";

const COLORS = [
  "oklch(0.8369 0.1644 84.4286)",
  "rgb(231, 150, 57)",
  "oklch(63.377% 0.17658 44.867)",
  "oklch(61.902% 0.10601 56.321)",
  "oklch(73.74% 0.1423 50.59)",
];

type CategoryDatum = { category: string; bookmarks: number };
type CommentActivityDatum = { month: string; comments: number };

// recharts spreads the row onto the click datum and also nests it under `.payload`.
type SliceClickDatum = Partial<CategoryDatum> & { payload?: CategoryDatum };
type BarClickDatum = Partial<CommentActivityDatum> & { payload?: CommentActivityDatum };

interface AnalyticsProps {
  data: CategoryDatum[];
  commentActivity: CommentActivityDatum[];
  comments: CommentRow[]; // the subscriber's own comments, most recent first
}

export function Analytics({ data, commentActivity, comments }: AnalyticsProps) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const total = data.reduce((sum, x) => sum + x.bookmarks, 0);
  const totalComments = commentActivity.reduce((s, m) => s + m.comments, 0);

  const goToCategory = (category: string) => {
    router.push(
      `/dashboard/profile/saved-articles?category=${encodeURIComponent(category)}`
    );
  };

  const handleSliceClick = (entry: SliceClickDatum) => {
    const category = entry?.payload?.category ?? entry?.category;
    if (category) goToCategory(category);
  };

  const handleMonthClick = (entry: BarClickDatum) => {
    const month = entry?.payload?.month ?? entry?.month;
    if (!month) return;
    setSelectedMonth((prev) => (prev === month ? null : month));
  };

  // No generic args -> uses recharts' default ValueType/NameType, matching
  // exactly what the `content` prop expects (avoids the contravariance error).
  const renderTooltip = ({ active, payload }: TooltipContentProps) => {
    if (!active || !payload?.length) return null;
    const row = payload[0].payload as CategoryDatum;
    const pct = total ? Math.round((row.bookmarks / total) * 100) : 0;
    return (
      <div className="rounded-md border bg-popover px-3 py-2 text-sm shadow-sm">
        <p className="font-medium text-popover-foreground">{row.category}</p>
        <p className="text-muted-foreground">
          {row.bookmarks} bookmark{row.bookmarks === 1 ? "" : "s"} · {pct}%
        </p>
        <p className="mt-1 text-xs text-muted-foreground">Click to filter →</p>
      </div>
    );
  };

  const renderActivityTooltip = ({ active, payload }: TooltipContentProps) => {
    if (!active || !payload?.length) return null;
    const row = payload[0].payload as CommentActivityDatum;
    const isSelected = selectedMonth === row.month;
    return (
      <div className="rounded-md border bg-popover px-3 py-2 text-sm shadow-sm">
        <p className="font-medium text-popover-foreground">{row.month}</p>
        <p className="text-muted-foreground">
          {row.comments} comment{row.comments === 1 ? "" : "s"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {isSelected ? "Click to clear filter" : "Click to filter comments ↓"}
        </p>
      </div>
    );
  };

  // month-over-month trend, comparing the last two seeded months
  const currentMonth = commentActivity[commentActivity.length - 1];
  const previousMonth = commentActivity[commentActivity.length - 2];
  let trend: { direction: "up" | "down" | "flat"; pct: number } | null = null;
  if (currentMonth && previousMonth) {
    if (previousMonth.comments === 0 && currentMonth.comments === 0) {
      trend = { direction: "flat", pct: 0 };
    } else if (previousMonth.comments === 0) {
      trend = { direction: "up", pct: 100 };
    } else {
      const pct = Math.round(
        ((currentMonth.comments - previousMonth.comments) / previousMonth.comments) * 100
      );
      trend = {
        direction: pct > 0 ? "up" : pct < 0 ? "down" : "flat",
        pct: Math.abs(pct),
      };
    }
  }

  const monthlyAvg = commentActivity.length
    ? (totalComments / commentActivity.length).toFixed(1)
    : "0";

  const bestMonth = commentActivity.reduce(
    (best, m) => (m.comments > best.comments ? m : best),
    commentActivity[0] ?? { month: "—", comments: 0 }
  );

  const filteredComments = selectedMonth
    ? comments.filter((c) => c.monthKey === selectedMonth)
    : comments;

  return (
    <section className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2 items-stretch">
        <Card className="flex h-full flex-col shadow">
          <CardHeader>
            <CardTitle>Bookmark Distribution</CardTitle>
            <CardDescription>
              By category — click a slice to filter
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 items-center justify-center [&_.recharts-surface]:outline-none [&_.recharts-surface]:focus:outline-none">
            {data.length > 0 ? (
              <div className="h-full w-full" style={{ minHeight: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    {/* Tooltip must be a direct child of PieChart, not inside Pie */}
                    <Tooltip content={renderTooltip} />
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="bookmarks"
                      nameKey="category"
                      label={({ payload }) => payload.category}
                      onClick={handleSliceClick}
                      onMouseEnter={(_, index) => setActiveIndex(index)}
                      onMouseLeave={() => setActiveIndex(null)}
                    >
                      {data.map((item, index) => (
                        <Cell
                          key={`cell-${item.category}`}
                          fill={COLORS[index % COLORS.length]}
                          style={{
                            cursor: "pointer",
                            opacity:
                              activeIndex === null || activeIndex === index
                                ? 1
                                : 0.5,
                            transition: "opacity 200ms ease-in-out",
                          }}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-muted-foreground py-8">No bookmark data</div>
            )}
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            Total bookmarks:
            <span className="ml-2 font-semibold text-foreground">{total}</span>
          </CardFooter>
        </Card>

        <Card className="flex h-full flex-col shadow">
          <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
            <div>
              <CardTitle>Your comment activity</CardTitle>
              <CardDescription>
                Last 12 months — click a bar to filter comments below
              </CardDescription>
            </div>
            {trend && (
              <span
                className={
                  "flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-medium " +
                  (trend.direction === "up"
                    ? "bg-emerald-500/10 text-emerald-600"
                    : trend.direction === "down"
                    ? "bg-red-500/10 text-red-600"
                    : "bg-muted text-muted-foreground")
                }
              >
                {trend.direction === "up" ? (
                  <TrendingUp className="h-3.5 w-3.5" />
                ) : trend.direction === "down" ? (
                  <TrendingDown className="h-3.5 w-3.5" />
                ) : (
                  <Minus className="h-3.5 w-3.5" />
                )}
                {trend.direction === "flat"
                  ? "No change"
                  : `${trend.pct}% vs last month`}
              </span>
            )}
          </CardHeader>
          <CardContent className="flex flex-1 flex-col">
            {totalComments > 0 ? (
              <>
                <div className="mb-4 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-lg border bg-muted/30 py-2">
                    <p className="text-lg font-semibold">{totalComments}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                  <div className="rounded-lg border bg-muted/30 py-2">
                    <p className="text-lg font-semibold">{monthlyAvg}</p>
                    <p className="text-xs text-muted-foreground">Avg / month</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedMonth((prev) =>
                        prev === bestMonth.month ? null : bestMonth.month
                      )
                    }
                    className="rounded-lg border bg-muted/30 py-2 transition-colors hover:bg-muted/60"
                  >
                    <p className="text-lg font-semibold">{bestMonth.comments}</p>
                    <p className="text-xs text-muted-foreground">
                      {bestMonth.month} (best)
                    </p>
                  </button>
                </div>
                <div className="flex-1" style={{ minHeight: 180 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={commentActivity}
                      margin={{ left: -20, right: 8, top: 8 }}
                    >
                      <CartesianGrid vertical={false} strokeOpacity={0.15} />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 11 }}
                      />
                      <YAxis
                        allowDecimals={false}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 11 }}
                        width={28}
                      />
                      <Tooltip content={renderActivityTooltip} />
                      <Bar
                        dataKey="comments"
                        radius={[4, 4, 0, 0]}
                        onClick={handleMonthClick}
                      >
                        {commentActivity.map((m) => (
                          <Cell
                            key={m.month}
                            fill={COLORS[1]}
                            style={{
                              cursor: "pointer",
                              opacity:
                                selectedMonth === null ||
                                selectedMonth === m.month
                                  ? 1
                                  : 0.3,
                              transition: "opacity 200ms ease-in-out",
                            }}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
                <MessageSquare className="h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  You haven&apos;t posted any comments yet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow">
        <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
          <div>
            <CardTitle>Your comments</CardTitle>
            <CardDescription>
              {selectedMonth
                ? `Showing comments from ${selectedMonth}`
                : "Everything you've posted, most recent first"}
            </CardDescription>
          </div>
          {selectedMonth && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedMonth(null)}
              className="gap-1"
            >
              <X className="h-3.5 w-3.5" />
              Clear filter
            </Button>
          )}
        </CardHeader>
        <CardContent className="max-h-96 overflow-y-auto">
          <CommentList comments={filteredComments} />
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          {selectedMonth ? `Comments in ${selectedMonth}` : "Total comments"}:
          <span className="ml-2 font-semibold text-foreground">
            {filteredComments.length}
          </span>
          {selectedMonth && (
            <span className="ml-1">of {comments.length}</span>
          )}
        </CardFooter>
      </Card>
    </section>
  );
}

export function AnalyticsPaywall() {
  return (
    <Card className="border-dashed shadow">
      <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Lock className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Analytics is a Pro feature</h3>
          <p className="max-w-sm text-sm text-muted-foreground">
            Upgrade your subscription to see your bookmark breakdown, comment
            activity, and full comment history.
          </p>
        </div>
        <Button asChild className="mt-2">
          <Link href="/dashboard/profile/sub">Upgrade to Pro</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

// ============================= shared =============================

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <Card className="shadow">
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}

type ArticleRow = {
  id: string;
  title: string;
  views: number;
  reactions: number;
  bookmarks: number;
  comments: number;
  editorsChoice: boolean;
};

type CommentRow = {
  id: string;
  content: string;
  author?: string; // omitted for a subscriber's own comment feed
  article: string;
  date: string;
  monthKey?: string; // "MMM yy" — used to filter by the comment-activity chart
};

export function CommentList({ comments }: { comments: CommentRow[] }) {
  if (!comments.length)
    return (
      <p className="text-sm text-muted-foreground py-4">No comments yet.</p>
    );
  return (
    <ul className="divide-y">
      {comments.map((c) => (
        <li key={c.id} className="py-3">
          <p className="text-sm line-clamp-3">{c.content}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {c.author ? `${c.author} · ` : ""}
            {c.article} · {c.date}
          </p>
        </li>
      ))}
    </ul>
  );
}

// ============================= EDITOR =============================

interface EditorAnalyticsProps {
  userCount: number;
  articleCount: number;
  commentCount: number;
  editorsChoiceCount: number;
  topArticles: (ArticleRow & { author: string })[];
  recentComments: CommentRow[];
  topAuthors: { alias: string; views: number; articles: number }[];
}

export function EditorAnalytics({
  userCount,
  articleCount,
  commentCount,
  editorsChoiceCount,
  topArticles,
  recentComments,
  topAuthors,
}: EditorAnalyticsProps) {
  return (
    <section className="space-y-6">
      <h2 className="text-lg font-semibold">Editor dashboard</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Users" value={userCount.toLocaleString()} />
        <StatCard label="Articles" value={articleCount.toLocaleString()} />
        <StatCard label="Comments" value={commentCount.toLocaleString()} />
        <StatCard label="Editor's Choice" value={editorsChoiceCount} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow">
          <CardHeader>
            <CardTitle>Top articles by views</CardTitle>
            <CardDescription>Platform-wide</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ width: "100%", height: 280 }}>
              <ResponsiveContainer>
                <BarChart
                  data={topArticles}
                  layout="vertical"
                  margin={{ left: 8 }}
                >
                  <CartesianGrid horizontal={false} strokeOpacity={0.2} />
                  <XAxis type="number" />
                  <YAxis
                    type="category"
                    dataKey="title"
                    width={120}
                    tickFormatter={(t: string) =>
                      t.length > 18 ? t.slice(0, 18) + "…" : t
                    }
                  />
                  <Tooltip />
                  <Bar dataKey="views" fill={COLORS[2]} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle>Top authors by total views</CardTitle>
          </CardHeader>
          <CardContent>
            {topAuthors.length ? (
              <ul className="divide-y">
                {topAuthors.map((a, i) => (
                  <li
                    key={a.alias}
                    className="flex items-center justify-between py-3 text-sm"
                  >
                    <span>
                      <span className="text-muted-foreground mr-2">
                        {i + 1}.
                      </span>
                      {a.alias}
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({a.articles} articles)
                      </span>
                    </span>
                    <span className="font-semibold">
                      {a.views.toLocaleString()} views
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground py-4">No authors.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow">
        <CardHeader>
          <CardTitle>Article performance</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr className="border-b">
                <th className="py-2 pr-4">Title</th>
                <th className="py-2 px-2">Author</th>
                <th className="py-2 px-2 text-right">Views</th>
                <th className="py-2 px-2 text-right">Reactions</th>
                <th className="py-2 px-2 text-right">Bookmarks</th>
                <th className="py-2 pl-2 text-right">Comments</th>
              </tr>
            </thead>
            <tbody>
              {topArticles.map((a) => (
                <tr key={a.id} className="border-b last:border-0">
                  <td className="py-2 pr-4">
                    {a.title}
                    {a.editorsChoice && (
                      <span className="ml-2 rounded bg-muted px-1.5 py-0.5 text-xs">
                        Editor&apos;s Choice
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-2 text-muted-foreground">
                    {a.author}
                  </td>
                  <td className="py-2 px-2 text-right">{a.views}</td>
                  <td className="py-2 px-2 text-right">{a.reactions}</td>
                  <td className="py-2 px-2 text-right">{a.bookmarks}</td>
                  <td className="py-2 pl-2 text-right">{a.comments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card className="shadow">
        <CardHeader>
          <CardTitle>Recent comments (moderation)</CardTitle>
          <CardDescription>Latest across all articles</CardDescription>
        </CardHeader>
        <CardContent>
          <CommentList comments={recentComments} />
        </CardContent>
      </Card>
    </section>
  );
}