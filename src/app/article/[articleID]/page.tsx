import { addView, getArticle, hasUserBookmarkedArticle } from "@/_actions/article-actions";
import Link from "next/link";
import Likes from "./_components/likes";
import Bookmark from "./_components/bookmark";
import Views from "./_components/views";
import { format } from "date-fns";
import CommentarySection from "./_components/commentary-section";
import TopLevelCommentForm from "./_components/top-level-comment-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import RouteHeading from "@/components/route-heading";
import ArticleDoesntExist from "./_components/article-doesnt-exists";
import prisma from "@/lib/prisma";

export default async function ArticlePage({ params }: { params: Promise<{ articleID: string }> }) {
    const { articleID } = await params;

    // Fetch article and session in parallel — one round-trip each instead of 3+
    const hdrs = await headers();
    const [article, session] = await Promise.all([
        getArticle(articleID),
        auth.api.getSession({ headers: hdrs }),
    ]);

    // Article not found
    if (!article.success || !article.data) {
        return <ArticleDoesntExist />;
    }

    // Check subscription permission (reuses already-fetched session)
    let hasPermission = false;
    if (session) {
        const checkPermission = await auth.api.userHasPermission({
            body: {
                userId: session.user.id,
                permissions: { article: ["read"] },
            },
            headers: hdrs,
        });
        if (checkPermission.success) hasPermission = true;
    }

    // Paywall: uncomment when subscription system is live
    // if (!hasPermission) {
    //     redirect(`/preview/${articleID}`);
    // }

    // Always calculate views and reactions (shown to everyone)
    const views = article.data.views.length;
    let totalReactions = 0;
    for (const r of article.data.reactions) {
        totalReactions += r.val;
    }

    // Get UserInfo.id from session — replaces getUserId() to avoid a second session call
    let userId: string | undefined | false = false;
    if (session) {
        const userInfo = await prisma.userInfo.findUnique({
            where: { userId: session.user.id },
            select: { id: true },
        });
        userId = userInfo?.id; // undefined = logged in but no UserInfo record; string = has record
    }

    // User-specific data — only when logged in with a UserInfo record
    let userReaction: { id: string; val: number } | undefined;
    let bookmarked = false;

    if (typeof userId === "string") {
        // Use already-fetched views — avoids a second getArticle call
        const alreadyViewed = article.data.views.some((v) => v.userId === userId);
        if (!alreadyViewed) {
            await addView(articleID, userId);
        }

        // Use already-fetched reactions — avoids a third getArticle call
        const existingReaction = article.data.reactions.find((r) => r.userId === userId);
        if (existingReaction) {
            userReaction = { id: existingReaction.id, val: existingReaction.val };
        }

        const bookmark = await hasUserBookmarkedArticle(articleID, userId);
        bookmarked = bookmark.success && bookmark.data === true;
    }

    // Build category heading
    let heading = "";
    article.data.category.forEach((c, i) => {
        heading += i + 1 !== article.data.category.length ? `${c.name}, ` : c.name;
    });

    return (
        <div className="p-2">
            <div className="w-5xl">
                {heading.length > 0 && <RouteHeading label={heading} />}
                <h1 className="font-extrabold text-2xl text-center">{article.data.title}</h1>
                <p className="text-lg font-semibold text-center">
                    by{" "}
                    {article.data.author.map((a, i) =>
                        i + 1 !== article.data.author.length ? `${a.alias}, ` : `${a.alias}`,
                    )}
                </p>
                <p className="mt-2 mb-4">{article.data.content}</p>
                <div className="flex border-b-2 mt-2 pb-2 text-sm">
                    <div className="flex border-r pr-2">
                        <Views num={views} />
                    </div>
                    {typeof userId === "string" && (
                        <>
                            <div className="flex border-r pr-2">
                                <Likes
                                    articleId={article.data.id}
                                    userId={userId}
                                    userReaction={userReaction?.val}
                                    num={totalReactions}
                                />
                            </div>
                            <div className="flex border-r pl-2 pr-2">
                                <Bookmark
                                    articleId={articleID}
                                    userId={userId}
                                    bookmarked={bookmarked}
                                />
                            </div>
                        </>
                    )}
                    <div className="flex ml-auto">
                        {article.data.location ? article.data.location + ", " : ""}
                        {format(article.data.createdAt, "yyyy-MM-dd HH:mm")}
                    </div>
                </div>
            </div>
            <h1 className="font-extrabold text-2xl text-center my-2">Comments</h1>
            <div className="border-b-2">
                {article.data.comments ? (
                    <CommentarySection
                        comments={article.data.comments}
                        articleId={article.data.id}
                    />
                ) : (
                    ""
                )}
            </div>
            {typeof userId === "string" ? (
                <div className="mt-4">
                    <TopLevelCommentForm articleId={article.data.id} />
                </div>
            ) : (
                <Link href="/login">Log in to write a comment.</Link>
            )}
        </div>
    );
}
