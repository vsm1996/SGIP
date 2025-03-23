-- DropForeignKey
ALTER TABLE `Mention` DROP FOREIGN KEY `Mention_mentionedUserId_fkey`;

-- DropIndex
-- DROP INDEX `Mention_mentionedUserId_key` ON `Mention`;

-- AddForeignKey
ALTER TABLE `Mention` ADD CONSTRAINT `Mention_mentionedUserId_fkey` FOREIGN KEY (`mentionedUserId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;