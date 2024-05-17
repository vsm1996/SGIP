-- DropForeignKey
ALTER TABLE `Like` DROP FOREIGN KEY `Like_commentId_fkey`;

-- DropForeignKey
ALTER TABLE `Like` DROP FOREIGN KEY `Like_commentReplyId_fkey`;

-- DropForeignKey
ALTER TABLE `Like` DROP FOREIGN KEY `Like_postId_fkey`;

-- DropForeignKey
ALTER TABLE `Like` DROP FOREIGN KEY `Like_userId_fkey`;

-- AlterTable
ALTER TABLE `Comment` ADD COLUMN `likes` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `CommentReply` ADD COLUMN `likes` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `Post` ADD COLUMN `likes` INTEGER NOT NULL DEFAULT 0;
