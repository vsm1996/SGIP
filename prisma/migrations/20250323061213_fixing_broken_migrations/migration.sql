-- DropForeignKey
ALTER TABLE `Mention` DROP FOREIGN KEY `Mention_userId_fkey`;

-- DropIndex
DROP INDEX `Mention_userId_key` ON `Mention`;

-- AlterTable
ALTER TABLE `Mention` ADD COLUMN `unread` BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX `Mention_userId_fkey` ON `Mention`(`userId`);

-- AddForeignKey
-- ALTER TABLE `Mention` ADD CONSTRAINT `Mention_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
