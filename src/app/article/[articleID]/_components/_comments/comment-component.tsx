import { getComment, getReplies } from "@/_actions/comment-actions";
import CommentItem from "./comment-item";

export default async function CommentComponent({
    commentId,
    num,
}: {
    commentId: string;
    num: number;
}) {
    const replies = await getReplies(commentId);
    const comment = await getComment(commentId);
    //console.log(comment.data.reactions);

    if (comment.success && comment.data && replies?.success) {
        return (
            <CommentItem
                id={comment.data.id}
                num={num}
                userId={comment.data.user_id}
                content={comment.data.content}
                createdAt={comment.data.createdAt}
                updatedAt={comment.data.updatedAt}
                reactions={comment.data.reactions}
                replies={replies.data}
            />
        );
    }
}
