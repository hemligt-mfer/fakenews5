
import {
    addView,
    getArticle,
    getUserReaction,
    hasUserBookmarkedArticle,
    hasUserViewedArticle,
} from "@/_actions/article-actions";
import Link from "next/link";
import Likes from "./_components/likes";
import Bookmark from "./_components/bookmark";
import { getUserId } from "@/_actions/user-actions";
import Views from "./_components/views";
import { format } from "date-fns";
import CommentarySection from "./_components/commentary-section";
import TopLevelCommentForm from "./_components/top-level-comment-form";

export default async function ArticlePage({ params }: { params: Promise<{ articleID: string }> }) {
    const { articleID } = await params;

    const userId = await getUserId();
    const article = await getArticle(articleID);

    if (!article.success || !article.data) {
        return <div className="p-2 text-muted-foreground">Article not found.</div>;
    }

    const views = article.data.views.length;

    // Total reaction score — always calculated, shown to everyone
    let totalReactions = 0;
    for (const r of article.data.reactions) {
        totalReactions += r.val;
    }

    // User-specific data — only fetched when logged in with a UserInfo record
    let userReaction: number | undefined;
    let bookmarked = false;

    if (typeof userId === "string") {
        const res = await hasUserViewedArticle(article.data.id, userId);
        if (res.success && !res.data) {
            await addView(articleID, userId);
        }
        const reaction = await getUserReaction(articleID, userId);
        if (reaction.success && reaction.data) {
            userReaction = reaction.data;
        }
        const bookmark = await hasUserBookmarkedArticle(articleID, userId);
        bookmarked = bookmark.success && bookmark.data === true;
    }

    return (
        <div className="p-2">
            <div className="w-5xl">
                {article.data.category.length > 0
                    ? article.data.category.map((c, i) =>
                          i + 1 !== article.data.category.length ? `${c.name}, ` : `${c.name}`,
                      )
                    : ""}
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
                                    userReaction={userReaction}
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
