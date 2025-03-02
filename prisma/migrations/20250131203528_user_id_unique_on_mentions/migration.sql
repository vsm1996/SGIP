/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Mention` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Mention_userId_key` ON `Mention`(`userId`);
