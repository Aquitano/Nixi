/*
 Warnings:

 - The primary key for the `profiles` table will be changed. If it partially fails, the table could be left without primary key constraint.
 - You are about to drop the column `id` on the `profiles` table. All the data in the column will be lost.
 */
-- DropForeignKey

ALTER TABLE "articles" DROP CONSTRAINT "articles_profileId_fkey";

-- DropForeignKey

ALTER TABLE "highlights" DROP CONSTRAINT "highlights_profileId_fkey";

-- DropForeignKey

ALTER TABLE "tags" DROP CONSTRAINT "tags_profileId_fkey";

-- AlterTable

ALTER TABLE "articles" ALTER COLUMN "profileId" SET DATA TYPE TEXT;

-- AlterTable

ALTER TABLE "highlights" ALTER COLUMN "profileId" SET DATA TYPE TEXT;

-- AlterTable

ALTER TABLE "profiles" DROP CONSTRAINT "profiles_pkey", DROP COLUMN "id",
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("userId");

-- AlterTable

ALTER TABLE "tags" ALTER COLUMN "profileId" SET DATA TYPE TEXT;

-- AddForeignKey

ALTER TABLE "articles"
    ADD CONSTRAINT "articles_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles" ("userId") ON DELETE CASCADE ON
    UPDATE
        CASCADE;

-- AddForeignKey

ALTER TABLE "tags"
    ADD CONSTRAINT "tags_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles" ("userId") ON DELETE CASCADE ON
    UPDATE
        CASCADE;

-- AddForeignKey

ALTER TABLE "highlights"
    ADD CONSTRAINT "highlights_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles" ("userId") ON DELETE CASCADE ON
    UPDATE
        CASCADE;

