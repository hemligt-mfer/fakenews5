"use client";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Comment, CommentReaction } from "@/lib/types";

export default function CommentItem({
    id,
    num,
    userId,
    content,
    createdAt,
    updatedAt,
}: {
    id: string;
    num: number;
    userId: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    reactions: CommentReaction[];
    replies: Comment[];
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{num}</CardTitle>
            </CardHeader>
        </Card>
    );
}
