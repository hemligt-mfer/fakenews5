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

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Comment from "./comment";
export default function CommentarySection({ comments }: { comments: Comment[] }) {
    return (
        <div>
            {comments.map((c, i) => {
                return <Comment key={i} num={i} data={c} />;
            })}
        </div>
    );
}
