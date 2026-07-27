import { getAllUserDataFromId, getUserId } from "@/_actions/user-actions";
import { getReplies, getUserReaction } from "@/_actions/comment-actions";
import ClientComment from "./client-comment";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { differenceInMinutes } from "date-fns";

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

export default async function CommentItem({
    num,
    data,
    level,
    articleId,
}: {
    num: number;
    data: CommentData;
    level: number;
    articleId: string;
}) {
    const userData = await getAllUserDataFromId(data.user_id);
    const currentUserId = await getUserId();

    let canEdit = false;
    //console.log(userData.data?.userInfoTable.id, currentUserId);
    if (userData.success && userData.data && currentUserId) {
        // Check if the user is the author of the comment
        // and if it has been less than 60 mins since it was posted.
        // In that case, allow the user to edit the comment.
        if (
            userData.data.userInfoTable.id == currentUserId &&
            differenceInMinutes(new Date(), data.createdAt) <= 60
        ) {
            canEdit = true;
        }
    }

    let userReaction: number | undefined;
    let reaction;
    if (currentUserId) {
        reaction = await getUserReaction(data.id, currentUserId);
    }
    if (reaction && reaction.success && reaction.data) {
        userReaction = reaction.data;
    }

    const replies = await getReplies(data.id);

    if (!(userData.success && userData.data && replies?.success && replies.data && currentUserId)) {
        return null;
    }
    const renderedReplies = replies.data.map((c, i) => (
        <div className="ml-6" key={c.id}>
            <CommentItem num={i} data={c} articleId={articleId} level={level + 1} />
        </div>
    ));

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/");

    const hasPermission = await auth.api.userHasPermission({
        body: {
            userId: session.user.id,
            permissions: { comments: ["delete"] },
        },
    });

    return (
        <ClientComment
            num={num}
            comment={data}
            commentAuthor={userData.data}
            currentUserId={currentUserId}
            userReaction={userReaction}
            articleId={articleId}
            level={level}
            parentComment={data.replyTo}
            canEdit={canEdit}
            canDelete={hasPermission.success}
        >
            {renderedReplies}
        </ClientComment>
    );
}
