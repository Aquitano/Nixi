/*
 Warnings:

 - You are about to drop the column `userId` on the `articles` table. All the data in the column will be lost.
 - You are about to drop the column `userId` on the `highlights` table. All the data in the column will be lost.
 - You are about to drop the column `userId` on the `tags` table. All the data in the column will be lost.
 - Added the required column `profileId` to the `articles` table without a default value. This is not possible if the table is not empty.
 - Added the required column `profileId` to the `highlights` table without a default value. This is not possible if the table is not empty.
 - Added the required column `profileId` to the `tags` table without a default value. This is not possible if the table is not empty.
 */
-- DropForeignKey

ALTER TABLE "articles" DROP CONSTRAINT "articles_userId_fkey";

-- DropForeignKey

ALTER TABLE "highlights" DROP CONSTRAINT "highlights_userId_fkey";

-- DropForeignKey

ALTER TABLE "tags" DROP CONSTRAINT "tags_userId_fkey";

-- AlterTable

ALTER TABLE "articles" DROP COLUMN "userId",
    ADD COLUMN "profileId" INTEGER NOT NULL;

-- AlterTable

ALTER TABLE "highlights" DROP COLUMN "userId",
    ADD COLUMN "profileId" INTEGER NOT NULL;

-- AlterTable

ALTER TABLE "tags" DROP COLUMN "userId",
    ADD COLUMN "profileId" INTEGER NOT NULL;

-- AddForeignKey

ALTER TABLE "articles"
    ADD CONSTRAINT "articles_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles" ("id") ON DELETE CASCADE ON
    UPDATE
        CASCADE;

-- AddForeignKey

ALTER TABLE "tags"
    ADD CONSTRAINT "tags_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles" ("id") ON DELETE CASCADE ON
    UPDATE
        CASCADE;

-- AddForeignKey

ALTER TABLE "highlights"
    ADD CONSTRAINT "highlights_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles" ("id") ON DELETE CASCADE ON
    UPDATE
        CASCADE;
