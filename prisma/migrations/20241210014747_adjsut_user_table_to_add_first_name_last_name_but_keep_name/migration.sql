-- DropIndex
DROP INDEX `Like_commentId_fkey` ON `Like`;

-- DropIndex
DROP INDEX `Like_commentReplyId_fkey` ON `Like`;

-- DropIndex
DROP INDEX `Like_postId_fkey` ON `Like`;

-- DropIndex
DROP INDEX `Like_userId_fkey` ON `Like`;

-- AlterTable
ALTER TABLE `Like` MODIFY `count` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `firstName` VARCHAR(191) NULL,
    ADD COLUMN `lastName` VARCHAR(191) NULL;
