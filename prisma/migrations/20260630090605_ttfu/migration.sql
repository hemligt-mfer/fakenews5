/*
  Warnings:

  - Added the required column `active` to the `NewsletterSettings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `NewsletterSettings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NewsletterSettings" ADD COLUMN     "active" BOOLEAN NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL;
