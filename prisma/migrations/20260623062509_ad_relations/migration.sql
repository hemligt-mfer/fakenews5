-- AlterTable
ALTER TABLE "plan" ADD COLUMN     "adFree" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "ad" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "listingType" TEXT NOT NULL DEFAULT 'sell',
    "category" TEXT NOT NULL,
    "subcategory" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER,
    "priceType" TEXT NOT NULL DEFAULT 'fixed',
    "condition" TEXT NOT NULL DEFAULT 'good',
    "location" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL DEFAULT '',
    "tier" TEXT NOT NULL DEFAULT 'basic',
    "photos" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'pending',

    CONSTRAINT "ad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "advertisement" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "label" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "linkUrl" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),

    CONSTRAINT "advertisement_pkey" PRIMARY KEY ("id")
);
