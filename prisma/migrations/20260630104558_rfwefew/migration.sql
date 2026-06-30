/*
  Warnings:

  - You are about to drop the column `newsletterId` on the `category` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "category_newsletterId_key";

-- AlterTable
ALTER TABLE "category" DROP COLUMN "newsletterId";
