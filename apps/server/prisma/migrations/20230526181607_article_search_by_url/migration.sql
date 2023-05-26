/*
  Warnings:

  - A unique constraint covering the columns `[link,profileId]` on the table `articles` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "articles_link_profileId_key" ON "articles"("link", "profileId");
