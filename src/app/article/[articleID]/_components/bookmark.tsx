"use client";

import {
    bookmarkArticle,
    hasUserBookmarkedArticle,
    unBookmarkArticle,
} from "@/_actions/article-actions";
import Button from "@/components/button";
import { BookmarkIcon, BookmarkCheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Bookmark({
    articleId,
    userId,
    bookmarked,
}: {
    articleId: string;
    userId: string;
    bookmarked: boolean;
}) {
    const router = useRouter();

    async function removeBookmark() {
        await unBookmarkArticle(articleId, userId);
        router.refresh();
    }

    async function addBookmark() {
        await bookmarkArticle(articleId, userId);
        router.refresh();
    }

    return (
        <div className="cursor-pointer">
            {bookmarked ? (
                <BookmarkCheckIcon onClick={removeBookmark} />
            ) : (
                <BookmarkIcon onClick={addBookmark} />
            )}
        </div>
    );
}
