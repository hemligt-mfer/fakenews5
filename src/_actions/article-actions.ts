"use server";

import prisma from "@/lib/prisma";
import { Result } from "@/lib/types";

type Article = {
    id: string;
    title: string;
    summary: string | null;
    content: string;
    comments: Comment[];
    views: View[];
    reactions: ArticleReaction[];
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
    location: string | null;
    author: Author[];
    category: Category[];
    editorsChoice: boolean;
    deleted: null | Date;
};

type Comment = {
    id: string;
    articleId: string;
    user_id: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    replyTo: string | null;
    reactions: CommentReaction[];
};

type View = {
    id: string;
    articleId: string;
    userId: string;
};

type ArticleReaction = {
    id: string;
    article_id: string;
    userId: string;
    val: number;
};

type Author = {
    id: string;
    alias: string;
    userId: string;
};

type Category = {
    id: string;
    name: string;
};

type CommentReaction = {
    id: string;
    commentId: string;
    userId: string;
    val: number;
};

type Bookmark = {
    id: string;
    articleId: string;
    user_id: string;
};

// Lean type for listing pages — no views/reactions needed
type ArticleSummary = {
    id: string;
    title: string;
    summary: string | null;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
    location: string | null;
    editorsChoice: boolean;
    author: Author[];
    category: Category[];
};

export async function getArticles(): Promise<Result<ArticleSummary[]>> {
    try {
        const articles = await prisma.article.findMany({
            include: { author: true, category: true },
            orderBy: { createdAt: "desc" },
        });
        return { success: true, data: articles };
    } catch (err) {
        return { success: false, error: `Couldn't fetch articles.\n\n${err}` };
    }
}

export async function getEditorsChoiceArticles(): Promise<Result<ArticleSummary[]>> {
    try {
        const articles = await prisma.article.findMany({
            where: { editorsChoice: true },
            include: { author: true, category: true },
            orderBy: { createdAt: "desc" },
        });
        return { success: true, data: articles };
    } catch (err) {
        return { success: false, error: `Couldn't fetch editor's choice articles.\n\n${err}` };
    }
}

export async function getMostPopularArticles(limit = 3): Promise<Result<ArticleSummary[]>> {
    try {
        const articles = await prisma.article.findMany({
            include: { author: true, category: true },
            orderBy: { views: { _count: "desc" } },
            take: limit,
        });
        return { success: true, data: articles };
    } catch (err) {
        return { success: false, error: `Couldn't fetch popular articles.\n\n${err}` };
    }
}

export async function getArticle(articleId: string): Promise<Result<Article>> {
    try {
        const article = await prisma.article.findUnique({
            where: { id: articleId },
            include: {
                author: true,
                category: true,
                comments: { include: { reactions: true } },
                reactions: true,
                views: true,
            },
        });
        if (article) return { success: true, data: article };
        else return { success: false, error: "Couldn't find article." };
    } catch (err) {
        return { success: false, error: `Couldn't fetch article from database.\n\n${err}` };
    }
}

export async function addReaction(
    articleId: string,
    userId: string,
    val: number,
): Promise<Result<ArticleReaction>> {
    const article = await getArticle(articleId);
    if (article.success && article.data) {
        const reaction = await prisma.articleReaction.create({
            data: { userId: userId, article_id: articleId, val: val },
        });
        if (reaction) {
            return { success: true, data: reaction };
        } else {
            return { success: false, error: `Couldn't create reaction to article ${articleId}.` };
        }
    } else {
        console.error(`Couldn't find article with id ${articleId}.`);
        return { success: false, error: `Couldn't find article with id ${articleId}.` };
    }
}

export async function changeReaction(
    articleId: string,
    userId: string,
): Promise<Result<ArticleReaction>> {
    try {
        const reaction = await getUserReaction(articleId, userId);
        if (reaction.success && reaction.data && reaction.data.val == 1) {
            const newReaction = await prisma.articleReaction.update({
                data: { val: -1 },
                where: { id: reaction.data.id },
            });
            return { success: true, data: newReaction };
        } else if (reaction.success && reaction.data && reaction.data.val == -1) {
            const newReaction = await prisma.articleReaction.update({
                data: { val: 1 },
                where: { id: reaction.data.id },
            });
            return { success: true, data: newReaction };
        } else {
            console.error(
                `An unknown error occurred while trying to change reaction to article ${articleId}.`,
            );
            return {
                success: false,
                error: `An unknown error occurred while trying to change reaction to article ${articleId}.`,
            };
        }
    } catch (err) {
        console.error(
            `An unknown error occurred while trying to change reaction to article ${articleId}.\n\”${err}`,
        );
        return {
            success: false,
            error: `An unknown error occurred while trying to change reaction to article ${articleId}.`,
        };
    }
}

// Finds out of user has reacted to an article and in that case if it was an upvote 1 or downvote -1
// If user hasn't reacted, returns null
export async function getUserReaction(
    articleId: string,
    userId: string,
): Promise<Result<ArticleReaction | null>> {
    try {
        const article = await getArticle(articleId);
        if (article.success && article.data) {
            for (const r of article.data.reactions) {
                if (r.userId === userId) {
                    return { success: true, data: r };
                }
            }
            return { success: true, data: null };
        } else {
            console.error(`Couldn't find article with id ${articleId}.`);
            return { success: false, error: `Couldn't find article with id ${articleId}.` };
        }
    } catch (err) {
        console.error(
            `An unknown error occurred when trying to fetch user reaction to article ${articleId}.`,
        );
        return {
            success: false,
            error: `An unknown error occurred when trying to fetch user reaction to article ${articleId}.`,
        };
    }
}

export async function removeUserReaction(
    articleId: string,
    userId: string,
): Promise<Result<ArticleReaction>> {
    try {
        const reaction = await getUserReaction(articleId, userId);
        if (reaction.success && reaction.data) {
            const res = await prisma.articleReaction.delete({
                where: { id: reaction.data.id },
            });
            return { success: true, data: res };
        } else {
            return { success: false, error: `Unable to fetch user reaction from the database.` };
        }
    } catch (err) {
        console.error(
            `An unknown error occurred when trying to remove an article reaction to article ${articleId}.\n\n${err}`,
        );
        return {
            success: false,
            error: `An unknown error occurred when trying to remove an article reaction to article ${articleId}.\n\n${err}`,
        };
    }
}

export async function bookmarkArticle(
    articleId: string,
    userId: string,
): Promise<Result<Bookmark>> {
    try {
        const res = await prisma.bookmark.create({
            data: { articleId: articleId, user_id: userId },
        });
        if (res) return { success: true, data: res };
        else return { success: false, error: `Couldn't add bookmark to article ${articleId}.` };
    } catch (err) {
        console.error(`Couldn't add bookmark to article ${articleId}.\n\n${err}`);
        return {
            success: false,
            error: `Couldn't add bookmark to article ${articleId}.\n\n${err}`,
        };
    }
}

export async function unBookmarkArticle(
    articleId: string,
    userId: string,
): Promise<Result<Bookmark>> {
    try {
        const bookmark = await prisma.bookmark.findFirst({
            where: { articleId: articleId, user_id: userId },
        });
        if (bookmark) {
            const removedBookmark = await prisma.bookmark.delete({ where: { id: bookmark.id } });
            if (removedBookmark) {
                return { success: true, data: removedBookmark };
            } else {
                console.error(`Couldn't delete bookmark to article ${articleId}.`);
                return {
                    success: false,
                    error: `Couldn't delete bookmark to article ${articleId}.`,
                };
            }
        } else {
            console.error(`Couldn't find bookmark to article ${articleId}.`);
            return { success: false, error: `Couldn't find bookmark to article ${articleId}.` };
        }
    } catch (err) {
        console.error(
            `An unknown error occurred when trying to delete bookmark to article ${articleId}.`,
        );
        return {
            success: false,
            error: `An unknown error occurred when trying to delete bookmark to article ${articleId}.`,
        };
    }
}

export async function hasUserBookmarkedArticle(
    articleId: string,
    userId: string,
): Promise<Result<boolean>> {
    try {
        const res = await prisma.bookmark.findFirst({
            where: { articleId: articleId, user_id: userId },
        });
        if (res) {
            return { success: true, data: true };
        } else {
            return { success: true, data: false };
        }
    } catch (err) {
        console.error(`An unknown error occurred when trying to fetch bookmarks.\n\n${err}`);
        return {
            success: false,
            error: `An unknown error occurred when trying to fetch bookmarks.\n\n${err}`,
        };
    }
}

export async function addView(articleId: string, userId: string): Promise<Result<View>> {
    try {
        const res = await prisma.articleView.create({ data: { articleId: articleId, userId } });
        if (res) {
            return { success: true, data: res };
        } else {
            return { success: false, error: `Couldn't add view to article ${articleId}.` };
        }
    } catch (err) {
        console.error(`Couldn't add view to article ${articleId}.`);
        return { success: false, error: `Couldn't add view to article ${articleId}.` };
    }
}

export async function hasUserViewedArticle(
    articleId: string,
    userId: string,
): Promise<Result<boolean>> {
    try {
        const article = await getArticle(articleId);
        if (article.success && article.data) {
            for (const v of article.data.views) {
                if (v.userId === userId) {
                    return { success: true, data: true };
                }
            }
            return { success: true, data: false };
        } else {
            console.error(`Couldn't access views to article ${articleId}.\n\n`);
            return { success: false, error: `Couldn't access views to article ${articleId}.\n\n` };
        }
    } catch (err) {
        console.error(`Couldn't access views to article ${articleId}.\n\n`);
        return { success: false, error: `Couldn't access views to article ${articleId}.\n\n` };
    }
}

export type ArticleWithScore = {
    a: {
        id: string;
        title: string;
        summary: string | null;
        image: string | null;
        createdAt: Date;
        updatedAt: Date;
        location: string | null;
        editorsChoice: boolean;
        deleted: Date | null;
        reactions: ArticleReaction[];
    };
    totalScore: number;
};

export async function topUpvotedArticle(): Promise<Result<ArticleWithScore[]>> {
    try {
        const articles = await prisma.article.findMany({ include: { reactions: true } });
        const articleWithScore = [];
        function compare(a: ArticleWithScore, b: ArticleWithScore) {
            if (a.totalScore < b.totalScore) {
                return 1;
            }
            if (a.totalScore > b.totalScore) {
                return -1;
            }
            return 0;
        }
        for (const a of articles) {
            let totalScore = 0;
            for (const r of a.reactions) {
                totalScore += r.val;
            }
            articleWithScore.push({ a, totalScore });
        }
        const sorted = articleWithScore.sort(compare);
        return { success: true, data: sorted };
    } catch (err) {
        console.error(
            `An unknown error occured when trying to fetch articles from the database.\n\n${err}`,
        );
        return {
            success: false,
            error: `An unknown error occured when trying to fetch articles from the database.\n\n${err}`,
        };
    }
}
