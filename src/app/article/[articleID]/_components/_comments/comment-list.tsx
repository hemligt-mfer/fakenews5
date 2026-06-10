"use client";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import type { Comment } from "@/lib/types";
import CommentComponent from "./comment-component";
import { useState } from "react";

export default function CommentList({
    comments,
    commentsPerPage,
}: {
    comments: Comment[];
    commentsPerPage: number;
}) {
    const [currentPage, setCurrentPage] = useState(1);
    const lastIndex = currentPage * commentsPerPage;
    const startIndex = lastIndex - commentsPerPage;
    const numberOfPages = Math.ceil(comments.length / commentsPerPage);
    const pageNumbers = Array.from(Array(numberOfPages).keys());
    const commentsToShow = comments.slice(startIndex, lastIndex);
    console.log(commentsToShow);
    return (
        <div>
            <ul>
                {commentsToShow.map((comment, i) => {
                    return <p key={comment.id}>Hej</p>;
                })}
            </ul>
            {numberOfPages > 1 ? (
                <div>
                    <Pagination className="flex">
                        <PaginationContent>
                            <PaginationPrevious className="cursor-pointer" />
                            {pageNumbers.length <= 10 ? (
                                pageNumbers.map((p, i) => (
                                    <PaginationItem key={i}>
                                        <PaginationLink>{p + 1}</PaginationLink>
                                    </PaginationItem>
                                ))
                            ) : (
                                <PaginationItem>
                                    {currentPage} / {pageNumbers.length}
                                </PaginationItem>
                            )}
                            <PaginationNext className="cursor-pointer" />
                        </PaginationContent>
                    </Pagination>
                </div>
            ) : (
                ""
            )}
        </div>
    );
}
