import { auth } from "@/lib/auth";
import {
    addView,
    getArticle,
    getUserReaction,
    hasUserBookmarkedArticle,
    hasUserViewedArticle,
} from "@/_actions/article-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CommentaryForm from "./_components/commentary-form";
import Link from "next/link";
import Likes from "./_components/likes";
import Bookmark from "./_components/bookmark";
import { getUserId } from "@/_actions/user-actions";
import Views from "./_components/views";
import Button from "@/components/button";
import { headers } from "next/headers";

export default async function ArticlePage({ params }: { params: Promise<{ articleID: string }> }) {
    const { articleID } = await params;

    const userId = await getUserId();
    const article = await getArticle(articleID);

    if (userId && article.success && article.data) {
        // Check if the user has viewed the article and add a view if not
        const res = await hasUserViewedArticle(article.data.id, userId);
        if (res.success && !res.data) {
            await addView(articleID, userId);
        }
        const views = article.data.views.length;

        // Calculate the total reactions (upvotes/downvotes) to one score
        const reactions = article.data.reactions;
        let totalReactions = 0;
        for (const r of reactions) {
            totalReactions += r.val;
        }

        // Figure out if the user has reacted to the article and in that case if it
        // was an upvote or downvote, reaction.data will be 1 for upvote, otherwise -1.
        let userReaction;
        const reaction = await getUserReaction(articleID, userId);
        if (reaction.success && reaction.data) {
            userReaction = reaction.data;
        }

        // Find out wether the user has bookmarked the article in question
        let bookmarked;
        const bookmark = await hasUserBookmarkedArticle(articleID, userId);
        if (bookmark.success && bookmark.data === true) {
            bookmarked = true;
        } else {
            bookmarked = false;
        }

        return (
            <div>
                <div className="w-5xl p-2">
                    <h1 className="font-extrabold text-2xl text-center">{article.data.title}</h1>
                    <p className="text-lg font-semibold text-center">
                        by{" "}
                        {article.data.author.map((a, i) =>
                            i + 1 !== article.data.author.length ? `${a.alias}, ` : `${a.alias}`,
                        )}
                    </p>
                    <p className="w-5xl">{article.data.content}</p>
                    <div className="flex border-b-2 mt-2 pb-2 text-sm">
                        <div className="flex border-r pr-2">
                            <Views num={views} />
                        </div>
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
                    </div>
                </div>
                <div className="w-2xl mx-auto">
                    <h1 className="font-extrabold text-2xl text-center">Comments</h1>
                    {userId !== null ? (
                        <CommentaryForm articleId={articleID} replyTo={null} />
                    ) : (
                        <Link href="login">Log in to write a comment.</Link>
                    )}
                </div>
            </div>
        );
    }
}
