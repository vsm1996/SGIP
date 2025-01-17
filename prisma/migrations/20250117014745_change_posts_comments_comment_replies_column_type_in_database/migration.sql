-- AlterTable
ALTER TABLE `Comment` MODIFY `message` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `CommentReply` MODIFY `message` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `Post` MODIFY `message` TEXT NOT NULL;
