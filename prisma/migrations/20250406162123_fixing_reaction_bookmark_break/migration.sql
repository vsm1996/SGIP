-- AlterTable
ALTER TABLE `Post` ADD COLUMN `content` TEXT NULL,
    ADD COLUMN `isRichText` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `Reaction` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'LIKE',
    `userId` VARCHAR(191) NOT NULL,
    `postId` VARCHAR(191) NULL,
    `commentId` VARCHAR(191) NULL,
    `commentReplyId` VARCHAR(191) NULL,
    `discussionId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Reaction_userId_fkey`(`userId`),
    INDEX `Reaction_postId_fkey`(`postId`),
    INDEX `Reaction_commentId_fkey`(`commentId`),
    INDEX `Reaction_commentReplyId_fkey`(`commentReplyId`),
    INDEX `Reaction_discussionId_fkey`(`discussionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Bookmark` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `postId` VARCHAR(191) NULL,
    `discussionId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Bookmark_userId_fkey`(`userId`),
    INDEX `Bookmark_postId_fkey`(`postId`),
    INDEX `Bookmark_discussionId_fkey`(`discussionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Reaction` ADD CONSTRAINT `Reaction_commentId_fkey` FOREIGN KEY (`commentId`) REFERENCES `Comment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reaction` ADD CONSTRAINT `Reaction_commentReplyId_fkey` FOREIGN KEY (`commentReplyId`) REFERENCES `CommentReply`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reaction` ADD CONSTRAINT `Reaction_discussionId_fkey` FOREIGN KEY (`discussionId`) REFERENCES `Discussion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reaction` ADD CONSTRAINT `Reaction_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reaction` ADD CONSTRAINT `Reaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bookmark` ADD CONSTRAINT `Bookmark_discussionId_fkey` FOREIGN KEY (`discussionId`) REFERENCES `Discussion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bookmark` ADD CONSTRAINT `Bookmark_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bookmark` ADD CONSTRAINT `Bookmark_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
