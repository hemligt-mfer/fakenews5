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
  topCommenter,
  topViewedArticle,
  topLikedArticle,
} from "./_actions/chart-actions";
import {
  LatestRegUsers,
  Counts,
  TopCommenter,
  TopViewedArticles,
  TopLikedArticles,
} from "./_components/charts/user-counts";
import { ChartPieUserSub } from "./_components/charts/pie-chart";

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
  console.log(hasPermission);
  if (!hasPermission.success) {
    redirect("/");
  }

  const chartData = await userCountryChart();
  const latest = await userReg();
  const articleCount = await articleCounts();
  const users = await userCounts();
  const comments = await commentCount();
  const topComment = await topCommenter();
  const topArticles = await topViewedArticle();
  const likes = await topLikedArticle();

  return (
    <div className="mb-10">
      <RouteHeading label="Admin dashboard" />
      <div className="flex justify-between m-10 gap-10">
        <ChartLineLinear />

        <div className="flex-row">
          <div className="mb-8">
            <Counts
              articleCount={articleCount}
              userCount={users}
              comments={comments}
            />
          </div>
          <div className="mb-8">
            <TopLikedArticles likes={likes} />
            {/* <TopCommenter
              user={topComment.user}
              commentCount={topComment.commentCount}
            /> */}
          </div>
          <div>
            <TopViewedArticles articles={topArticles} />
          </div>
        </div>
      </div>
      <div className="flex m-10 gap-12 justify-between">
        <CountryChart chartData={chartData} />
        <LatestRegUsers data={latest} />

        <ChartPieUserSub />
      </div>
    </div>
  );
}
