import prisma from "@/lib/prisma";
import { DataTable } from "@/components/Data-table";
import RouteHeading from "@/components/route-heading";
import { columns } from "@/lib/article-columns";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ArticleTablePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/");
  }

  const userId = session.user.id;

  const hasPermission = await auth.api.userHasPermission({
    body: {
      userId: userId,
      permissions: {
        article: ["create", "update", "like", "dislike", "comment", "delete"],
      },
    },
  });
  if (!hasPermission) {
    redirect("/");
  }
  const articles = await prisma.article.findMany({});

  return (
    <div className="w-full">
      <RouteHeading label="Articles" />
      <DataTable columns={columns} data={articles} />
    </div>
  );
}
