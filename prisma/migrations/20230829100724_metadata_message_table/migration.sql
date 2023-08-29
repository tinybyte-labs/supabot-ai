/*
  Warnings:

  - You are about to drop the column `sources` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "sources",
ADD COLUMN     "metadata" JSONB;
