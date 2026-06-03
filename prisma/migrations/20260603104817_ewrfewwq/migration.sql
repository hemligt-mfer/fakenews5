/*
  Warnings:

  - You are about to drop the column `userInfoId` on the `CommentReaction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CommentReaction" DROP CONSTRAINT "CommentReaction_userInfoId_fkey";

-- AlterTable
ALTER TABLE "CommentReaction" DROP COLUMN "userInfoId";
