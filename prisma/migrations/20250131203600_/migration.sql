/*
  Warnings:

  - A unique constraint covering the columns `[mentionedUserId]` on the table `Mention` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Mention_mentionedUserId_key` ON `Mention`(`mentionedUserId`);
