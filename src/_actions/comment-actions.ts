"use server";

import prisma from "@/lib/prisma";
import { Result } from "@/lib/types";
import { getUserId } from "./user-actions";
import { success } from "zod";
import { error } from "console";

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

type CommentReaction = {
    id: string;
    commentId: string;
    userId: string;
    val: number;
};

export async function getComment(commentId: string): Promise<Result<Comment>> {
    try {
        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
            include: { reactions: true },
        });
        if (comment)
            return {
                success: true,
                data: comment,
            };
        else return { success: false, error: `Error when fetching comment with id ${commentId}.` };
    } catch (err) {
        console.error(`Error when fetching comment with id ${commentId}.\n\n${err}`);
        return {
            success: false,
            error: `Error when fetching comment with id ${commentId}.\n\”${err}`,
        };
    }
}

export async function addComment(
    articleId: string,
    comment: string,
    replyTo: string | null,
): Promise<Result<boolean>> {
    const userId = await getUserId();
    if (userId) {
        try {
            const res = await prisma.comment.create({
                data: {
                    articleId: articleId,
                    content: comment,
                    user_id: userId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    replyTo: replyTo,
                },
            });
            return { success: true, data: true };
        } catch (err) {
            console.error(`Couldn't add comment to the database.\n\n${err}`);
            return { success: false, error: `Couldn't add comment to the database.\n\n${err}` };
        }
    } else {
        console.error(`Can't make a comment without being logged in.`);
        return { success: false, error: `Can't make a comment without being logged in.` };
    }
}

export async function addReaction(
    commentId: string,
    userId: string,
    val: number,
): Promise<Result<CommentReaction>> {
    const comment = await getComment(commentId);
    if (comment.success && comment.data) {
        const reaction = await prisma.commentReaction.create({
            data: { userId: userId, commentId: commentId, val: val },
        });
        if (reaction) {
            return { success: true, data: reaction };
        } else {
            return {
                success: false,
                error: `Couldn't add reaction to comment with id ${commentId}.`,
            };
        }
    } else {
        console.error(`Couldn't add reaction to comment with id ${commentId}.`);
        return { success: false, error: `Couldn't add reaction to comment with id ${commentId}.` };
    }
}

export async function getUserReaction(
    commentId: string,
    userId: string,
): Promise<Result<number | null>> {
    try {
        const comment = await getComment(commentId);
        if (comment.success && comment.data) {
            for (const r of comment.data.reactions) {
                if (r.userId === userId) {
                    return { success: true, data: r.val };
                }
            }
            return { success: true, data: null };
        } else {
            console.error(`Couldn't find comment with id ${commentId}.`);
            return { success: false, error: `Couldn't find comment with id ${commentId}.` };
        }
    } catch (err) {
        console.error(
            `An unknown error occurred when trying to fetch user reaction to comment with id ${commentId}.\n\n${err}`,
        );
        return {
            success: false,
            error: `An unknown error occurred when trying to fetch user reaction to comment with id ${commentId}.\n\n${err}`,
        };
    }
}

export async function changeReaction(
    commentId: string,
    userId: string,
): Promise<Result<CommentReaction>> {
    try {
        const reaction = await getUserReaction(commentId, userId);
        if (reaction.success && reaction.data == 1) {
            const newReaction = await prisma.commentReaction.update({
                data: { val: -1 },
                where: { commentId: commentId, userId: userId },
            });
            return { success: true, data: newReaction };
        } else if (reaction.success && reaction.data == -1) {
            const newReaction = await prisma.commentReaction.update({
                data: { val: 1 },
                where: { commentId: commentId, userId: userId },
            });
            return { success: true, data: newReaction };
        } else {
            console.error(
                `An unknown error occurred when trying to update user reaction to comment with id ${commentId}.`,
            );
            return {
                success: false,
                error: `An unknown error occurred when trying to update user reaction to comment with id ${commentId}.`,
            };
        }
    } catch (err) {
        console.error(
            `An unknown error occurred when trying to update user reaction to comment with id ${commentId}.\n\n${err}`,
        );
        return {
            success: false,
            error: `An unknown error occurred when trying to update user reaction to comment with id ${commentId}.`,
        };
    }
}

export async function removeUserReaction(
    commentId: string,
    userId: string,
): Promise<Result<CommentReaction>> {
    try {
        const res = await prisma.commentReaction.delete({
            where: { commentId: commentId, userId: userId },
        });
        return { success: true, data: res };
    } catch (err) {
        console.error(
            `An unknown error occurred when trying to remove reaction for user ${userId} on comment ${commentId}\n\n${err}`,
        );
        return {
            success: false,
            error: `An unknown error occurred when trying to remove reaction for user ${userId} on comment ${commentId}\n\n${err}`,
        };
    }
}

export async function getReplies(commentId: string) {
    try {
        const replies = await prisma.comment.findMany({
            where: { replyTo: commentId },
            include: { reactions: true },
            orderBy: { createdAt: "desc" },
        });
        return { success: true, data: replies };
    } catch (err) {
        console.error(`Couldn't fetch replies to comment ${commentId}.\n\n${err}`);
    }
}

export async function deleteComment(commentId: string): Promise<Result<boolean>> {
    try {
        const comment = await getComment(commentId);
        if (comment.success && comment.data) {
            const updated = comment.data.updatedAt;
            const res = await prisma.comment.update({
                data: { content: "This comment has been removed by admin.", updatedAt: updated },
                where: { id: commentId },
            });
            if (res) return { success: true, data: true };
            else
                return {
                    success: false,
                    error: `Couldn't find comment with id ${commentId}.`,
                };
        } else {
            const msg = `Couldn't fetch comment with id ${commentId}.`;
            console.error(msg);
            return { success: false, error: msg };
        }
    } catch (err) {
        const msg = `An unknown error occurred when trying to delete comment with id ${commentId}.\n\n${err}`;
        console.error(msg);
        return { success: false, error: msg };
    }
}

export async function updateComment(commentId: string, content: string) {
    try {
        const comment = await getComment(commentId);
        if (comment.success && comment.data) {
            const res = await prisma.comment.update({
                data: { content: content, updatedAt: new Date() },
                where: { id: commentId },
            });
            if (res) return { success: true, data: res };
            else {
                const msg = `Couldn't update comment with id ${commentId}.`;
                console.error(msg);
                return { success: false, error: msg };
            }
        } else {
            const msg = `Couldn't fetch comment with id ${commentId}.`;
            console.error(msg);
            return { success: false, error: msg };
        }
    } catch (err) {
        const msg = `An unknown error occurred when trying to edit comment with id ${commentId}.\n\n${err}`;
        console.error(msg);
        return { success: false, error: msg };
    }
}
