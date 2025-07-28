/*
  Warnings:

  - You are about to alter the column `rental_price` on the `book` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(10,2)`.
  - You are about to alter the column `book_price` on the `book` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(10,2)`.
  - You are about to alter the column `state` on the `book` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `Enum(EnumId(2))`.
  - You are about to drop the column `book_id` on the `cart` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `cart` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `cart` table. All the data in the column will be lost.
  - You are about to drop the column `book_id` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `rental_end` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `rental_start` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `total_price` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `order` table. All the data in the column will be lost.
  - You are about to drop the `account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `review` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `verificationtoken` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `total_cart` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `borrower_id` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Made the column `password` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `role` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `account` DROP FOREIGN KEY `Account_userId_fkey`;

-- DropForeignKey
ALTER TABLE `cart` DROP FOREIGN KEY `Cart_book_id_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_book_id_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `review` DROP FOREIGN KEY `Review_book_id_fkey`;

-- DropForeignKey
ALTER TABLE `review` DROP FOREIGN KEY `Review_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `session` DROP FOREIGN KEY `Session_userId_fkey`;

-- DropIndex
DROP INDEX `Cart_book_id_fkey` ON `cart`;

-- DropIndex
DROP INDEX `Order_book_id_fkey` ON `order`;

-- DropIndex
DROP INDEX `Order_user_id_fkey` ON `order`;

-- AlterTable
ALTER TABLE `book` MODIFY `sku` VARCHAR(191) NOT NULL,
    MODIFY `rental_price` DECIMAL(10, 2) NOT NULL,
    MODIFY `book_price` DECIMAL(10, 2) NOT NULL,
    MODIFY `state` ENUM('pending', 'cancelled', 'not_rented', 'renting') NOT NULL DEFAULT 'pending',
    MODIFY `description` VARCHAR(1000) NULL;

-- AlterTable
ALTER TABLE `cart` DROP COLUMN `book_id`,
    DROP COLUMN `created_at`,
    DROP COLUMN `quantity`,
    ADD COLUMN `total_cart` DECIMAL(10, 2) NOT NULL;

-- AlterTable
ALTER TABLE `category` ADD COLUMN `description` VARCHAR(500) NOT NULL,
    MODIFY `name` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `book_id`,
    DROP COLUMN `quantity`,
    DROP COLUMN `rental_end`,
    DROP COLUMN `rental_start`,
    DROP COLUMN `status`,
    DROP COLUMN `total_price`,
    DROP COLUMN `user_id`,
    ADD COLUMN `borrower_id` INTEGER NOT NULL,
    ADD COLUMN `state` ENUM('pending', 'confirmed', 'cancelled') NOT NULL DEFAULT 'pending',
    ADD COLUMN `total` DECIMAL(10, 2) NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `password` VARCHAR(255) NOT NULL,
    MODIFY `email` VARCHAR(255) NOT NULL,
    MODIFY `role` ENUM('admin', 'lender', 'borrower') NOT NULL DEFAULT 'borrower';

-- DropTable
DROP TABLE `account`;

-- DropTable
DROP TABLE `review`;

-- DropTable
DROP TABLE `session`;

-- DropTable
DROP TABLE `verificationtoken`;

-- CreateTable
CREATE TABLE `CartItem` (
    `cart_item_id` INTEGER NOT NULL AUTO_INCREMENT,
    `cart_id` INTEGER NOT NULL,
    `book_id` INTEGER NOT NULL,
    `rental_date` DATETIME(3) NOT NULL,
    `return_date` DATETIME(3) NOT NULL,
    `added_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`cart_item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderItem` (
    `order_item_id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER NOT NULL,
    `book_id` INTEGER NOT NULL,
    `rental_price` DECIMAL(10, 2) NOT NULL,
    `rental_date` DATE NOT NULL,
    `return_date` DATE NOT NULL,
    `order_date` DATETIME(3) NOT NULL,

    PRIMARY KEY (`order_item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InvoiceItem` (
    `invoice_item_id` INTEGER NOT NULL AUTO_INCREMENT,
    `invoice_id` INTEGER NOT NULL,
    `book_id` INTEGER NOT NULL,
    `rental_price` DECIMAL(10, 2) NOT NULL,
    `rental_date` DATE NOT NULL,
    `return_date` DATE NOT NULL,
    `pay_date` DATETIME(3) NOT NULL,

    PRIMARY KEY (`invoice_item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Invoice` (
    `invoice_id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `state` ENUM('unpaid', 'paid', 'refunded') NOT NULL DEFAULT 'unpaid',
    `total` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`invoice_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReturnBook` (
    `return_id` INTEGER NOT NULL AUTO_INCREMENT,
    `invoice_item_id` INTEGER NOT NULL,
    `return_date` DATE NOT NULL,
    `state` ENUM('not_returned', 'pending', 'returned') NOT NULL DEFAULT 'not_returned',
    `reason` VARCHAR(1000) NOT NULL,

    UNIQUE INDEX `ReturnBook_invoice_item_id_key`(`invoice_item_id`),
    PRIMARY KEY (`return_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_book_id_fkey` FOREIGN KEY (`book_id`) REFERENCES `Book`(`book_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_cart_id_fkey` FOREIGN KEY (`cart_id`) REFERENCES `Cart`(`cart_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_borrower_id_fkey` FOREIGN KEY (`borrower_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_book_id_fkey` FOREIGN KEY (`book_id`) REFERENCES `Book`(`book_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceItem` ADD CONSTRAINT `InvoiceItem_invoice_id_fkey` FOREIGN KEY (`invoice_id`) REFERENCES `Invoice`(`invoice_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceItem` ADD CONSTRAINT `InvoiceItem_book_id_fkey` FOREIGN KEY (`book_id`) REFERENCES `Book`(`book_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReturnBook` ADD CONSTRAINT `ReturnBook_invoice_item_id_fkey` FOREIGN KEY (`invoice_item_id`) REFERENCES `InvoiceItem`(`invoice_item_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `book` RENAME INDEX `sku` TO `Book_sku_key`;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `email` TO `User_email_key`;
