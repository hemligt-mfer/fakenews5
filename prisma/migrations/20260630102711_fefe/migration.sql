/*
  Warnings:

  - You are about to drop the column `newsletterSettingsId` on the `author` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "author" DROP CONSTRAINT "author_newsletterSettingsId_fkey";

-- AlterTable
ALTER TABLE "author" DROP COLUMN "newsletterSettingsId";

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
