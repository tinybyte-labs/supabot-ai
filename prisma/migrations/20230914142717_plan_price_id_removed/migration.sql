/*
  Warnings:

  - You are about to drop the column `plan` on the `organizations` table. All the data in the column will be lost.
  - You are about to drop the column `price_id` on the `organizations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "organizations" DROP COLUMN "plan",
DROP COLUMN "price_id";
