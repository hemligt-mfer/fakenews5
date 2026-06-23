import {
    addView,
    getArticle,
    getUserReaction,
    hasUserBookmarkedArticle,
} from "@/_actions/article-actions";
import Link from "next/link";
import Likes from "./_components/likes";
import Bookmark from "./_components/bookmark";
import { getUserId } from "@/_actions/user-actions";
import Views from "./_components/views";
import { format } from "date-fns";
import CommentarySection from "./_components/commentary-section";
import TopLevelCommentForm from "./_components/top-level-comment-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ArticleDoesntExist from "./_components/article-doesnt-exists";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkIns from "remark-ins";
import InArticleAd from "@/components/in-article-ad";
import Image from "next/image";

export default async function ArticlePage({ params }: { params: Promise<{ articleID: string }> }) {
    const { articleID } = await params;

    const userId = await getUserId();
    const article = await getArticle(articleID);
    // console.log(article);

    let hasPermission = false;
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (session) {
        const checkPermission = await auth.api.userHasPermission({
            body: {
                userId: session?.user.id,
                permissions: {
                    article: ["read", "like", "dislike", "comment"],
                },
            },
        });
        if (checkPermission.success === true) {
            hasPermission = true;
        }
    }

    if (userId && hasPermission && article.success && article.data) {
        await addView(articleID);
        // Check if the user has viewed the article and add a view if not
        const views = article.data.views;
        // console.log(views);

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
            <div className="flex-row justify-center w-full px-4 py-2">
                {article.data.category.length > 0 &&
                    article.data.category.map((c, i) => {
                        if (i + 1 !== article.data.category.length)
                            return (
                                <Link key={i} href={`/category/${c.id}`}>
                                    {c.name},{" "}
                                </Link>
                            );
                        else
                            return (
                                <Link key={i} href={`/category/${c.id}`}>
                                    {c.name}
                                </Link>
                            );
                    })}
                <h1 className="font-extrabold text-3xl text-center">{article.data.title}</h1>

                {article.data.image && (
                    <div className="relative w-1/2 mx-auto aspect-video my-4 overflow-hidden border border-border">
                        <Image
                            src={article.data.image}
                            alt={article.data.title}
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 768px) 100vw, 900px"
                        />
                    </div>
                )}

                <article className="mt-2 mb-4 max-w-none prose dark:bg-white border p-4">
                    <ReactMarkdown remarkPlugins={[remarkGfm, remarkIns]}>
                        {hasPermission ? article.data.content : article.data.content.slice(0, 500)}
                    </ReactMarkdown>
                </article>
                <InArticleAd />
                <div className="flex border-b-2 mt-2 pb-2 text-sm">
                    <div className="flex border-r pr-2">
                        <Views num={views} />
                    </div>

                    <div className="flex border-r pr-2">
                        <Likes
                            articleId={article.data.id}
                            userId={userId}
                            userReaction={userReaction?.val}
                            num={totalReactions}
                        />
                    </div>
                    <div className="flex border-r pl-2 pr-2">
                        <Bookmark articleId={articleID} userId={userId} bookmarked={bookmarked} />
                    </div>

                    <div className="flex ml-auto">
                        <p className="text-md font-semibold text-center mr-4">
                            by{" "}
                            {article.data.author.map((a, i) =>
                                i + 1 !== article.data.author.length
                                    ? `${a.alias}, `
                                    : `${a.alias}`,
                            )}
                        </p>
                        {article.data.location ? article.data.location + ", " : ""}
                        {format(article.data.createdAt, "yyyy-MM-dd HH:mm")}
                    </div>
                </div>
                <h1 className="font-extrabold text-2xl text-center my-2">Comments</h1>
                <div className="border-b-2 md:w-3xl mx-auto">
                    {article.data.comments ? (
                        <CommentarySection
                            comments={article.data.comments}
                            articleId={article.data.id}
                        />
                    ) : (
                        ""
                    )}
                </div>
                {userId !== null ? (
                    <div className="mt-4">
                        <TopLevelCommentForm articleId={article.data.id} />
                    </div>
                ) : (
                    <Link href="login">Log in to write a comment.</Link>
                )}
            </div>
        );
    } else if (article.success === false) {
        return <ArticleDoesntExist />;
    } else if (!hasPermission) {
        redirect(`preview/${articleID}`);
    } else {
        redirect(`preview/${articleID}`);
    }
}
