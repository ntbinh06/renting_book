/*
  Warnings:

  - You are about to drop the column `user_name` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `account` MODIFY `refresh_token` TEXT NULL,
    MODIFY `access_token` TEXT NULL,
    MODIFY `scope` TEXT NULL,
    MODIFY `id_token` TEXT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `user_name`,
    ADD COLUMN `emailVerified` DATETIME(3) NULL,
    ADD COLUMN `name` VARCHAR(255) NULL,
    MODIFY `password` VARCHAR(255) NULL;

-- CreateTable
CREATE TABLE `review` (
    `review_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `rating` INTEGER NOT NULL,
    `image` VARCHAR(255) NULL,
    `comment` VARCHAR(1000) NULL,
    `review_date` DATETIME(3) NOT NULL,

    PRIMARY KEY (`review_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `review_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
