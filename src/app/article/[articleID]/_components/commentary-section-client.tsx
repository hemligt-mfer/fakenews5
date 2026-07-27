"use client";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { useState, type ReactNode } from "react";

export default function CommentarySectionClient({
    totalCount,
    children,
    commentsPerPage,
}: {
    totalCount: number;
    children: ReactNode[];
    commentsPerPage: number;
}) {
    const [page, setPage] = useState(1);
    const totalPages = Math.ceil(children.length / commentsPerPage);
    const start = (page - 1) * commentsPerPage;
    const visible = children.slice(start, start + commentsPerPage);

    return (
        <div>
            {visible}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                    <Pagination>
                        <PaginationContent>
                            <PaginationPrevious
                                className="cursor-pointer"
                                onClick={() => {
                                    if (page !== 1) {
                                        setPage((p) => p - 1);
                                    }
                                }}
                            />

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <PaginationItem key={p}>
                                    <PaginationLink
                                        className={
                                            page === p
                                                ? "underline font-semibold"
                                                : "cursor-pointer"
                                        }
                                    >
                                        {p}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationNext
                                className="cursor-pointer"
                                onClick={() => {
                                    if (page !== totalPages) {
                                        setPage(page + 1);
                                    }
                                }}
                            />
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
}
