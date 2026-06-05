"use server";
import RouteHeading from "@/components/route-heading";
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
                article: ["create", "update", "delete"],
            },
        },
    });
    if (!hasPermission.success) {
        redirect("/");
    }
    return (
        <div className="w-full">
            <RouteHeading label="Add article"/>

            <div className="flex pt-10">
                <AddArticleForm />
            </div>
        </div>
    );
}
