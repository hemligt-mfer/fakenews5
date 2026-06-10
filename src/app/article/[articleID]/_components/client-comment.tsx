"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import CommentaryReactions from "./commentary-reactions";
import { format } from "date-fns";
import { useState, type ReactNode } from "react";
import ReplyForm from "./reply-form";

type CommentData = {
    id: string;
    articleId: string;
    user_id: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    replyTo: string | null;
    reactions: CommentReaction[];
};
type CommentReaction = { id: string; commentId: string; userId: string; val: number };

type UserInfo = {
    id: string;
    userId: string;
    phoneNumber: string | null;
    address_id: string;
    birthdate: Date;
};
type User = {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
    role: string | null;
    banned: boolean | null;
    banReason: string | null;
    banExpires: Date | null;
};
type AllUserData = { userInfoTable: UserInfo; user: User };

export default function ClientComment({
    num,
    comment,
    commentAuthor,
    currentUserId,
    userReaction,
    articleId,
    level,
    parentComment,
    children,
}: {
    num: number;
    comment: CommentData;
    commentAuthor: AllUserData;
    currentUserId: string;
    userReaction: number | undefined;
    articleId: string;
    level: number;
    parentComment: string | null;
    children?: ReactNode;
}) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const totalReactions = comment.reactions.reduce((acc, r) => acc + r.val, 0);

    return (
        <div className="mx-auto">
            <Card className="mb-5">
                <CardHeader className="border-b">
                    <CardTitle>
                        <div className="flex items-center">
                            <button
                                className="mr-auto flex items-center gap-2 text-left"
                                onClick={() => setCollapsed((c) => !c)}
                            >
                                {level === 0 ? (
                                    <strong className="font-extrabold">#{num + 1}</strong>
                                ) : (
                                    <span>#{num + 1}</span>
                                )}
                                <span className="text-xs font-normal text-muted-foreground">
                                    {collapsed ? "▶ show" : "▼ hide"}
                                </span>
                            </button>
                            <Button
                                className="cursor-pointer"
                                onClick={() => setShowReplyForm(true)}
                            >
                                Reply
                            </Button>
                        </div>
                    </CardTitle>
                </CardHeader>

                {!collapsed && (
                    <>
                        <CardContent>
                            <p>{comment.content}</p>
                        </CardContent>
                        <CardFooter>
                            <CommentaryReactions
                                commentId={comment.id}
                                userId={currentUserId}
                                userReaction={userReaction}
                                num={totalReactions}
                            />
                            <div className="flex">
                                by {commentAuthor.user.name}{" "}
                                {format(comment.createdAt, "yyyy-MM-dd HH:mm")}
                            </div>
                        </CardFooter>
                    </>
                )}
            </Card>

            {!collapsed && showReplyForm && (
                <ReplyForm
                    articleId={articleId}
                    replyTo={level > 1 ? parentComment : comment.id}
                    edit={false}
                />
            )}

            {!collapsed && children}
        </div>
    );
}
