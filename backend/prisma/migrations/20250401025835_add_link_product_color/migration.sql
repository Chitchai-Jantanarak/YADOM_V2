-- AlterTable
ALTER TABLE `cart_items` ADD COLUMN `productColorId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `cart_items` ADD CONSTRAINT `cart_items_productColorId_fkey` FOREIGN KEY (`productColorId`) REFERENCES `ProductColor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
