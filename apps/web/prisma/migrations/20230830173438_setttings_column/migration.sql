/*
  Warnings:

  - You are about to drop the column `fontSize` on the `Chatbot` table. All the data in the column will be lost.
  - You are about to drop the column `placeholderText` on the `Chatbot` table. All the data in the column will be lost.
  - You are about to drop the column `primaryBgColor` on the `Chatbot` table. All the data in the column will be lost.
  - You are about to drop the column `primaryFgColor` on the `Chatbot` table. All the data in the column will be lost.
  - You are about to drop the column `welcomeMessage` on the `Chatbot` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chatbot" DROP COLUMN "fontSize",
DROP COLUMN "placeholderText",
DROP COLUMN "primaryBgColor",
DROP COLUMN "primaryFgColor",
DROP COLUMN "welcomeMessage",
ADD COLUMN     "settings" JSONB;
