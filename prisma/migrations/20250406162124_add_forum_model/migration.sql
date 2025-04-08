-- CreateTable
CREATE TABLE `Forum` (
    `id` VARCHAR(191) NOT NULL,
    `title` TEXT NOT NULL,
    `description` TEXT NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `creatorId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Forum_slug_key`(`slug`),
    INDEX `Forum_creatorId_idx`(`creatorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ForumModerator` (
    `id` VARCHAR(191) NOT NULL,
    `forumId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ForumModerator_forumId_idx`(`forumId`),
    INDEX `ForumModerator_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Forum` ADD CONSTRAINT `Forum_creatorId_fkey` FOREIGN KEY (`creatorId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ForumModerator` ADD CONSTRAINT `ForumModerator_forumId_fkey` FOREIGN KEY (`forumId`) REFERENCES `Forum`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ForumModerator` ADD CONSTRAINT `ForumModerator_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD COLUMN `forumId` VARCHAR(191);

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_forumId_fkey` FOREIGN KEY (`forumId`) REFERENCES `Forum`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;