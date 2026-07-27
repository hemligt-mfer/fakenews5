import RouteHeading from "@/components/route-heading";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ChartLineLinear } from "./_components/charts/line-chart";
import { CountryChart } from "./_components/charts/bar-chart";
import {
  userCountryChart,
  userReg,
  articleCounts,
  userCounts,
  commentCount,
  subscribedUsers,
  latestSub,
  getWeeklyRevenue,
  usersNotSubed,
  recentComments,
} from "./_actions/chart-actions";
import {
  LatestRegUsers,
  Counts,
  TopViewedArticles,
  TopUpvotedArticle,
  CommentedArticles,
} from "./_components/charts/user-counts";
import { ChartPieUserSub } from "./_components/charts/pie-chart";
import {
  getTopViewedArticle,
  topUpvotedArticle,
} from "@/_actions/article-actions";

export default async function AdminDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/");
  }
  const hasPermission = await auth.api.userHasPermission({
    body: {
      userId: session?.user.id,
      permissions: {
        article: ["create", "update", "delete", "read"],
      },
    },
  });
  if (session.user.role !== "admin" && hasPermission.success) {
    redirect("/");
  }

  const chartData = await userCountryChart();
  const latest = await userReg();
  const articleCount = await articleCounts();
  const users = await userCounts();
  const comments = await commentCount();
  const topArticles = await getTopViewedArticle(1);
  const likes = await topUpvotedArticle();
  const subs = await subscribedUsers();
  const latestS = await latestSub();
  const revenueData = await getWeeklyRevenue();
  const usersNotSubbed = await usersNotSubed();
  const recentComment = await recentComments();
  let mostUpvotedArticle;
  if (likes.success && likes.data) {
    mostUpvotedArticle = likes.data[0];
  }
  if (mostUpvotedArticle !== undefined) {
    return (
      <div className="flex-row mb-10">
        <RouteHeading label="Admin dashboard" />
        <div className="w-4/5 mx-auto">
          <div className="flex flex-col md:flex-row  gap-10 mt-5">
            <ChartLineLinear data={revenueData} />
            <ChartPieUserSub
              users={users}
              subscribers={subs}
              latestSub={latestS}
              notSub={usersNotSubbed}
            />
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-10 mt-5">
            <div className="flex gap-10 justify-between">
              <Counts
                articleCount={articleCount}
                userCount={users}
                comments={comments}
              />
              <LatestRegUsers data={latest} />
            </div>
            <div className=" gap-10">
              <TopUpvotedArticle article={mostUpvotedArticle} />
              {topArticles.success && topArticles.data ? (
                <TopViewedArticles articles={topArticles.data} />
              ) : (
                ""
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row mt-5 gap-10 justify-between">
            <CountryChart chartData={chartData} />
            <CommentedArticles recentComments={recentComment} />
          </div>
        </div>
      </div>
    );
  }
}
