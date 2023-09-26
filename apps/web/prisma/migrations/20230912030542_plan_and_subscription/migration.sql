/*
  Warnings:

  - A unique constraint covering the columns `[subscription_id]` on the table `organizations` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "plan" TEXT NOT NULL DEFAULT 'free',
ADD COLUMN     "subscription_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "organizations_subscription_id_key" ON "organizations"("subscription_id");
