/*
  Warnings:

  - You are about to drop the column `priceId` on the `organizations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "organizations" DROP COLUMN "priceId",
ADD COLUMN     "price_id" TEXT;
