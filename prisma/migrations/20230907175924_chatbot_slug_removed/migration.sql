/*
  Warnings:

  - You are about to drop the column `slug` on the `chatbots` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "chatbots_slug_key";

-- AlterTable
ALTER TABLE "chatbots" DROP COLUMN "slug";
