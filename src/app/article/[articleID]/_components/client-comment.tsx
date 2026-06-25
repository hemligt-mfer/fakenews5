"use client";
import { Button } from "@/components/ui/button";
import CommentaryReactions from "./commentary-reactions";
import { format } from "date-fns";
import { useState, type ReactNode } from "react";
import ReplyForm from "./reply-form";
import { Children } from "react";
import DeleteCommentButton from "../manage-comments/_components/delete-comment-button";

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

type CommentReaction = {
  id: string;
  commentId: string;
  userId: string;
  val: number;
};

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
  canDelete = false,
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
  canDelete: boolean;
  children?: ReactNode;
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const totalReactions = comment.reactions.reduce((acc, r) => acc + r.val, 0);
  const replies = Children.toArray(children);
  return (
    <div className="flex mb-5 justify-center w-full">
     {level > 0 && (
  <div className="relative w-5 shrink-0 mt-2.5 h-5">
    <div className="absolute -left-12 top-2 w-15 h-0.5 bg-muted-foreground" />
    <div className="bg-muted-foreground h-5 w-5 [clip-path:polygon(0%_0%,100%_50%,0%_100%)]" />
  </div>
)}

      <div className="w-full border-l-4 border-muted-foreground">
        <div className="">
          <div className="border-b bg-chart-5 dark:bg-chart-4 py-2">
            <div className="flex items-center justify-between">
              <div className="mx-5 ">
                <span>{commentAuthor.user.name} </span>
              </div>
              <div className="flex gap-2 mx-5 justify-center">
                {format(comment.createdAt, "yyyy-MM-dd HH:mm")}
                {level === 0 ? (
                  <strong className="font-extrabold">#{num + 1}</strong>
                ) : (
                  <span>#{num + 1}</span>
                )}
                {canDelete ? (
                  <DeleteCommentButton commentId={comment.id} />
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          <div className="px-5 py-2 bg-background">
            <p>{comment.content}</p>
          </div>
          <div className="flex items-center px-5 bg-muted dark:bg-background">
            <div className="flex w-full justify-between ">
              <CommentaryReactions
                commentId={comment.id}
                userId={currentUserId}
                userReaction={userReaction}
                num={totalReactions}
              />
              <div className="p-1">
                {replies.length > 4 && (
                  <Button
                    className="mx-auto"
                    size="xs"
                    onClick={() => setCollapsed((c) => !c)}
                  >
                    {collapsed ? "Show replies" : "Hide replies"}
                  </Button>
                )}
                <Button
                  className="cursor-pointer"
                  size="xs"
                  onClick={() => setShowReplyForm((f) => !f)}
                >
                  {showReplyForm ? "Cancel" : "Reply"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {showReplyForm && (
          <ReplyForm
            articleId={articleId}
            replyTo={level > 1 ? parentComment : comment.id}
            edit={false}
            onDone={() => setShowReplyForm(false)}
          />
        )}

        {!collapsed && children && (
  <div className="relative pl-6 pb-2">
    {children}
  </div>
)}
      </div>
    </div>
  );
}
