"use client";

import { addReaction, changeReaction, removeUserReaction } from "@/_actions/article-actions";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Likes({
    articleId,
    userId,
    userReaction,
    num,
}: {
    articleId: string;
    userId: string;
    userReaction: number | undefined;
    num: number;
}) {
    const router = useRouter();

    async function upvote() {
        if (userReaction == -1) {
            await changeReaction(articleId, userId);
        } else if (userReaction == undefined) {
            await addReaction(articleId, userId, 1);
        } else if (userReaction == 1) {
            await removeUserReaction(articleId, userId);
        }
        router.push(`http://localhost:3000/article/${articleId}`);
    }

    async function downvote() {
        if (userReaction == 1) {
            await changeReaction(articleId, userId);
        } else if (userReaction == undefined) {
            await addReaction(articleId, userId, -1);
        } else if (userReaction == -1) {
            await removeUserReaction(articleId, userId);
        }
        router.push(`http://localhost:3000/article/${articleId}`);
    }

    return (
        <div className="flex pl-2">
            <ThumbsUp
                fill={userReaction == 1 ? "black" : "white"}
                size={20}
                onClick={upvote}
                className="cursor-pointer"
            />
            <ThumbsDown
                fill={userReaction == -1 ? "black" : "white"}
                size={20}
                onClick={downvote}
                className="cursor-pointer"
            />
            <span className="my-auto ml-1">{num}</span>
        </div>
    );
}
