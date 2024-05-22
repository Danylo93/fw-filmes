/*
  Warnings:

  - A unique constraint covering the columns `[userId,mediaId,mediaType]` on the table `Favorite` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,mediaId,mediaType]` on the table `Watchlist` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `path` to the `Favorite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `posterImageUrl` to the `Favorite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Favorite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Favorite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `Watchlist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `posterImageUrl` to the `Watchlist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Watchlist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Watchlist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Favorite" ADD COLUMN     "path" TEXT NOT NULL,
ADD COLUMN     "posterImageUrl" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Watchlist" ADD COLUMN     "path" TEXT NOT NULL,
ADD COLUMN     "posterImageUrl" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_mediaId_mediaType_key" ON "Favorite"("userId", "mediaId", "mediaType");

-- CreateIndex
CREATE UNIQUE INDEX "Watchlist_userId_mediaId_mediaType_key" ON "Watchlist"("userId", "mediaId", "mediaType");
