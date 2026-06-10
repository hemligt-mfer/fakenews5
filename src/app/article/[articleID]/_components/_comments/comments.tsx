import { getReplies, getTopComments } from "@/_actions/comment-actions";
import CommentList from "./comment-list";

export default async function Comments({ articleId }: { articleId: string }) {
    const topComments = await getTopComments(articleId);

    const commentData = [];

    if (topComments.success && topComments.data) {
        for (const c of topComments.data) {
            const replies = await getReplies(c.id);
        }
    }

    console.log(topComments);
    if (topComments.success && topComments.data) {
        return (
            <div>
                <CommentList comments={topComments.data} commentsPerPage={1} />
            </div>
        );
    }
}
