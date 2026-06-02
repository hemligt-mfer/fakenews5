"use server";
import AddArticleForm from "./_components/add-article-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AddArticlePage() {
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
    return (
        <div className="w-full">
            <div className="flex items-center ml-5">
                <h1 className="text-3xl text-red-600">/</h1>
                <h1 className="text-2xl text-muted-foreground">Add article</h1>
            </div>

            <div className="flex pt-10">
                <AddArticleForm />
            </div>
        </div>
    );
}
