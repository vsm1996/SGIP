-- -- CreateTable
-- CREATE TABLE `Account` (
--     `id` VARCHAR(191) NOT NULL,
--     `userId` VARCHAR(191) NOT NULL,
--     `type` VARCHAR(191) NOT NULL,
--     `provider` VARCHAR(191) NOT NULL,
--     `providerAccountId` VARCHAR(191) NOT NULL,
--     `refresh_token` TEXT NULL,
--     `access_token` TEXT NULL,
--     `expires_at` INTEGER NULL,
--     `token_type` VARCHAR(191) NULL,
--     `scope` VARCHAR(191) NULL,
--     `id_token` TEXT NULL,
--     `session_state` VARCHAR(191) NULL,
--     `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

--     INDEX `Account_userId_idx`(`userId`),
--     UNIQUE INDEX `Account_provider_providerAccountId_key`(`provider`, `providerAccountId`),
--     PRIMARY KEY (`id`)
-- ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- -- CreateTable
-- CREATE TABLE `User` (
--     `id` VARCHAR(191) NOT NULL,
--     `firstName` VARCHAR(191) NULL,
--     `lastName` VARCHAR(191) NULL,
--     `name` VARCHAR(191) NULL,
--     `username` VARCHAR(191) NULL,
--     `email` VARCHAR(191) NULL,
--     `emailVerified` DATETIME(3) NULL,
--     `hashedPassword` VARCHAR(191) NULL,
--     `image` VARCHAR(191) NULL,
--     `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

--     UNIQUE INDEX `User_username_key`(`username`),
--     UNIQUE INDEX `User_email_key`(`email`),
--     PRIMARY KEY (`id`)
-- ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- -- CreateTable
-- CREATE TABLE `Discussion` (
--     `id` VARCHAR(191) NOT NULL,
--     `title` TEXT NOT NULL,
--     `content` TEXT NOT NULL,
--     `userId` VARCHAR(191) NOT NULL,
--     `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
--     `updatedAt` DATETIME(3) NOT NULL,

--     PRIMARY KEY (`id`)
-- ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- -- CreateTable
-- CREATE TABLE `Post` (
--     `id` VARCHAR(191) NOT NULL,
--     `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
--     `message` TEXT NOT NULL,
--     `userId` VARCHAR(191) NOT NULL,
--     `sessionId` VARCHAR(191) NULL,

--     PRIMARY KEY (`id`)
-- ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- -- CreateTable
-- CREATE TABLE `Comment` (
--     `id` VARCHAR(191) NOT NULL,
--     `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
--     `message` TEXT NOT NULL,
--     `userId` VARCHAR(191) NOT NULL,
--     `postId` VARCHAR(191) NOT NULL,
--     `discussionId` VARCHAR(191) NULL,

--     PRIMARY KEY (`id`)
-- ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- -- CreateTable
-- CREATE TABLE `CommentReply` (
--     `id` VARCHAR(191) NOT NULL,
--     `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
--     `message` TEXT NOT NULL,
--     `userId` VARCHAR(191) NOT NULL,
--     `commentId` VARCHAR(191) NULL,

--     PRIMARY KEY (`id`)
-- ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- -- CreateTable
-- CREATE TABLE `Like` (
--     `id` VARCHAR(191) NOT NULL,
--     `userId` VARCHAR(191) NOT NULL,
--     `discussionId` VARCHAR(191) NULL,
--     `postId` VARCHAR(191) NULL,
--     `commentId` VARCHAR(191) NULL,
--     `commentReplyId` VARCHAR(191) NULL,

--     PRIMARY KEY (`id`)
-- ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- -- CreateTable
-- CREATE TABLE `Notification` (
--     `id` VARCHAR(191) NOT NULL,
--     `userId` VARCHAR(191) NOT NULL,
--     `type` VARCHAR(191) NOT NULL,
--     `message` TEXT NOT NULL,
--     `read` BOOLEAN NOT NULL DEFAULT false,
--     `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

--     PRIMARY KEY (`id`)
-- ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- -- CreateTable
-- CREATE TABLE `Mention` (
--     `id` VARCHAR(191) NOT NULL,
--     `userId` VARCHAR(191) NOT NULL,
--     `mentionedUserId` VARCHAR(191) NOT NULL,
--     `discussionId` VARCHAR(191) NULL,
--     `postId` VARCHAR(191) NULL,
--     `commentId` VARCHAR(191) NULL,
--     `commentReplyId` VARCHAR(191) NULL,
--     `unread` BOOLEAN NOT NULL DEFAULT true,
--     `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

--     PRIMARY KEY (`id`)
-- ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- -- CreateTable
-- CREATE TABLE `Session` (
--     `id` VARCHAR(191) NOT NULL,
--     `sessionToken` VARCHAR(191) NOT NULL,
--     `userId` VARCHAR(191) NOT NULL,
--     `expires` DATETIME(3) NOT NULL,

--     UNIQUE INDEX `Session_sessionToken_key`(`sessionToken`),
--     PRIMARY KEY (`id`)
-- ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- -- CreateTable
-- CREATE TABLE `VerificationToken` (
--     `identifier` VARCHAR(191) NOT NULL,
--     `token` VARCHAR(191) NOT NULL,
--     `expires` DATETIME(3) NOT NULL,

--     UNIQUE INDEX `VerificationToken_token_key`(`token`),
--     UNIQUE INDEX `VerificationToken_identifier_token_key`(`identifier`, `token`)
-- ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- -- AddForeignKey
-- ALTER TABLE `Account` ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE `Discussion` ADD CONSTRAINT `Discussion_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE `Post` ADD CONSTRAINT `Post_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE `Comment` ADD CONSTRAINT `Comment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE `Comment` ADD CONSTRAINT `Comment_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE `Comment` ADD CONSTRAINT `Comment_discussionId_fkey` FOREIGN KEY (`discussionId`) REFERENCES `Discussion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE `CommentReply` ADD CONSTRAINT `CommentReply_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE `CommentReply` ADD CONSTRAINT `CommentReply_commentId_fkey` FOREIGN KEY (`commentId`) REFERENCES `Comment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE `Like` ADD CONSTRAINT `Like_discussionId_fkey` FOREIGN KEY (`discussionId`) REFERENCES `Discussion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE `Like` ADD CONSTRAINT `Like_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE `Like` ADD CONSTRAINT `Like_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE `Like` ADD CONSTRAINT `Like_commentId_fkey` FOREIGN KEY (`commentId`) REFERENCES `Comment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE `Like` ADD CONSTRAINT `Like_commentReplyId_fkey` FOREIGN KEY (`commentReplyId`) REFERENCES `CommentReply`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE `Mention` ADD CONSTRAINT `Mention_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE `Mention` ADD CONSTRAINT `Mention_mentionedUserId_fkey` FOREIGN KEY (`mentionedUserId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE `Mention` ADD CONSTRAINT `Mention_discussionId_fkey` FOREIGN KEY (`discussionId`) REFERENCES `Discussion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE `Mention` ADD CONSTRAINT `Mention_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE `Mention` ADD CONSTRAINT `Mention_commentId_fkey` FOREIGN KEY (`commentId`) REFERENCES `Comment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE `Mention` ADD CONSTRAINT `Mention_commentReplyId_fkey` FOREIGN KEY (`commentReplyId`) REFERENCES `CommentReply`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;