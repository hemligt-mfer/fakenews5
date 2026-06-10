"use client";
import { useState } from "react";
import CommentItem from "./comment-item";
import { Comment } from "@/lib/types";

const PAGE_SIZE = 5;

export default function CommentarySection({
    articleId,
    comments,
}: {
    articleId: string;
    comments: Comment[];
}) {
    const [page, setPage] = useState(1);

    const topLevel = comments.filter((c) => !c.replyTo);
    const visible = topLevel.slice(0, page * PAGE_SIZE);
    const hasMore = visible.length < topLevel.length;

    return (
        <div>
            {visible.map((c, i) => (
                <CommentItem key={c.id} num={i} data={c} articleId={articleId} level={0} />
            ))}
            {hasMore && (
                <button className="mt-2 text-sm underline" onClick={() => setPage((p) => p + 1)}>
                    Load more ({topLevel.length - visible.length} remaining)
                </button>
            )}
        </div>
    );
}
