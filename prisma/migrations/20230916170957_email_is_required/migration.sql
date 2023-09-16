/*
  Warnings:

  - Made the column `email` on table `chatbot_users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "chatbot_users" ALTER COLUMN "email" SET NOT NULL;
