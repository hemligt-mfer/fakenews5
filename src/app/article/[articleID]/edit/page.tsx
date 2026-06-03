import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getArticleForEdit } from "./_actions/edit-article-action";
import EditArticleForm from "./_components/edit-article-form";
import RouteHeading from "@/components/route-heading";

export default async function EditArticlePage({
    params,
}: {
    params: Promise<{ articleID: string }>;
}) {
    const { articleID } = await params;

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return redirect("/");

    const hasPermission = await auth.api.userHasPermission({
        body: {
            userId: session.user.id,
            permissions: { article: ["update"] },
        },
    });
    if (!hasPermission.success) redirect("/");

    const result = await getArticleForEdit(articleID);
    if (!result.success) redirect("/dashboard/admin/articles");

    return (
        <div className="w-full">
            <RouteHeading label="Edit article" />
            <div className="flex pt-6">
                <EditArticleForm articleId={articleID} defaultValues={result.data} />
            </div>
        </div>
    );
}
