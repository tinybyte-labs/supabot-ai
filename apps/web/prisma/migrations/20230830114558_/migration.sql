/*
  Warnings:

  - You are about to drop the column `primaryColor` on the `Chatbot` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chatbot" DROP COLUMN "primaryColor",
ADD COLUMN     "primaryBgColor" VARCHAR(32),
ADD COLUMN     "primaryFgColor" VARCHAR(32);
