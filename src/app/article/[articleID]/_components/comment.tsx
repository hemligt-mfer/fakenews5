import { getAllUserDataFromId } from "@/_actions/user-actions";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import CommentaryReactions from "./commentary-reactions";
import { getUserReaction } from "@/_actions/comment-actions";

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

export default async function Comment({ num, data }: { num: number; data: Comment }) {
    const userData = await getAllUserDataFromId(data.user_id);
    console.log(data);

    // Calculate the total reactions (upvotes/downvotes) to one score
    const reactions = data.reactions;
    let totalReactions = 0;
    for (const r of reactions) {
        totalReactions += r.val;
    }

    // Figure out if the user has reacted to the comment and in that case if it
    // was a upvote or downvote.
    let userReaction;
    const reaction = await getUserReaction(data.id, data.user_id);
    if (reaction.success && reaction.data) {
        userReaction = reaction.data;
    }

    if (userData.success && userData.data) {
        return (
            <Card>
                <CardContent>
                    <p>{data.content}</p>
                </CardContent>
                <CardFooter>
                    <CommentaryReactions
                        commentId={data.id}
                        userId={data.user_id}
                        userReaction={userReaction}
                        num={totalReactions}
                    />
                    <div className="flex">
                        <div>
                            by {userData.data[0].name} {format(data.createdAt, "yyyy-MM-dd HH:mm")}
                        </div>
                    </div>
                </CardFooter>
            </Card>
        );
    }
}
