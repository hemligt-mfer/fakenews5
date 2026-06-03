-- AlterTable
ALTER TABLE "CommentReaction" ADD COLUMN     "userInfoId" TEXT;

-- AddForeignKey
ALTER TABLE "CommentReaction" ADD CONSTRAINT "CommentReaction_userInfoId_fkey" FOREIGN KEY ("userInfoId") REFERENCES "user_info"("id") ON DELETE SET NULL ON UPDATE CASCADE;
