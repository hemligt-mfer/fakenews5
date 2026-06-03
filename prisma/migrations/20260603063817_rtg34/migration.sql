/*
  Warnings:

  - You are about to drop the `article_like` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "article_like" DROP CONSTRAINT "article_like_article_id_fkey";

-- AlterTable
ALTER TABLE "CommentReaction" ADD COLUMN     "val" INTEGER NOT NULL DEFAULT 1;

-- DropTable
DROP TABLE "article_like";

-- CreateTable
CREATE TABLE "article_reaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "article_id" TEXT NOT NULL,
    "val" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "article_reaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "article_reaction_userId_key" ON "article_reaction"("userId");

-- AddForeignKey
ALTER TABLE "article_reaction" ADD CONSTRAINT "article_reaction_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
