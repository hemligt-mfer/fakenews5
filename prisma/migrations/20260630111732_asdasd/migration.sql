/*
  Warnings:

  - You are about to drop the column `newsletterSettingsId` on the `author` table. All the data in the column will be lost.
  - You are about to drop the column `newsletterId` on the `category` table. All the data in the column will be lost.
  - Added the required column `active` to the `NewsletterSettings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `NewsletterSettings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "author" DROP CONSTRAINT "author_newsletterSettingsId_fkey";

-- DropIndex
DROP INDEX "category_newsletterId_key";

-- AlterTable
ALTER TABLE "NewsletterSettings" ADD COLUMN     "active" BOOLEAN NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "author" DROP COLUMN "newsletterSettingsId";

-- AlterTable
ALTER TABLE "category" DROP COLUMN "newsletterId";

-- CreateTable
CREATE TABLE "_AuthorToNewsletterSettings" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AuthorToNewsletterSettings_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AuthorToNewsletterSettings_B_index" ON "_AuthorToNewsletterSettings"("B");

-- AddForeignKey
ALTER TABLE "_AuthorToNewsletterSettings" ADD CONSTRAINT "_AuthorToNewsletterSettings_A_fkey" FOREIGN KEY ("A") REFERENCES "author"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuthorToNewsletterSettings" ADD CONSTRAINT "_AuthorToNewsletterSettings_B_fkey" FOREIGN KEY ("B") REFERENCES "NewsletterSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
