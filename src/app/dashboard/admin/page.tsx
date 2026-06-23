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
  topViewedArticle,
  subscribedUsers,
  latestSub,
  getWeeklyRevenue,
  usersNotSubed,
} from "./_actions/chart-actions";
import {
  LatestRegUsers,
  Counts,
  TopViewedArticles,
  TopUpvotedArticle,
} from "./_components/charts/user-counts";
import { ChartPieUserSub } from "./_components/charts/pie-chart";
import { topUpvotedArticle } from "@/_actions/article-actions";
import { ArticleForm } from "@/components/article-form";


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
  const topArticles = await topViewedArticle();
  const likes = await topUpvotedArticle();
  const subs = await subscribedUsers();
  const latestS = await latestSub();
  const revenueData = await getWeeklyRevenue();
  const usersNotSubbed = await usersNotSubed();
  let mostUpvotedArticle;
  if (likes.success && likes.data) {
    mostUpvotedArticle = likes.data[0];
  }
  if (mostUpvotedArticle !== undefined) {
    return (
      <div className="mb-10">
        <RouteHeading label="Admin dashboard" />
        <div className="flex justify-between m-10 gap-10">
          <ChartLineLinear data={revenueData} />

          <div className="flex-row">
            <div className="mb-8">
              <Counts
                articleCount={articleCount}
                userCount={users}
                comments={comments}
              />
            </div>
            <div className="mb-8">
              <TopUpvotedArticle article={mostUpvotedArticle} />
            </div>
            <div>
              <TopViewedArticles articles={topArticles} />
            </div>
          </div>
        </div>
        <div className="flex m-10 gap-12 justify-between">
          <CountryChart chartData={chartData} />
          <LatestRegUsers data={latest} />

          <ChartPieUserSub
            users={users}
            subscribers={subs}
            latestSub={latestS}
            notSub={usersNotSubbed}
          />
        </div>
      </div>
    );
  }
}
