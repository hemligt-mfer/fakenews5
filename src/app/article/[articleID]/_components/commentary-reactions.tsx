"use client";

import { addReaction, changeReaction, removeUserReaction } from "@/_actions/comment-actions";
import { CommentReaction } from "@/generated/prisma/client";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CommentaryReactions({
    commentId,
    userId,
    userReaction,
    num,
}: {
    commentId: string;
    userId: string;
    userReaction: number | undefined;
    num: number;
}) {
    const router = useRouter();

    async function upvote() {
        if (userReaction == -1) {
            await changeReaction(commentId, userId);
        } else if (userReaction == undefined) {
            await addReaction(commentId, userId, 1);
        } else if (userReaction == 1) {
            await removeUserReaction(commentId, userId);
        }
        router.refresh();
    }

    async function downvote() {
        if (userReaction == 1) {
            await changeReaction(commentId, userId);
        } else if (userReaction == undefined) {
            await addReaction(commentId, userId, -1);
        } else if (userReaction == -1) {
            await removeUserReaction(commentId, userId);
        }
        router.refresh();
    }

    return (
        <div className="flex mr-auto">
            <ThumbsUp size={17} onClick={upvote} fill={userReaction == 1 ? "black" : "white"} />
            <ThumbsDown
                size={17}
                onClick={downvote}
                fill={userReaction == -1 ? "black" : "white"}
            />
            <span className="my-auto ml-1">{num}</span>
        </div>
    );
}
