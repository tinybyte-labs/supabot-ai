/*
  Warnings:

  - A unique constraint covering the columns `[customer_id]` on the table `organizations` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "customer_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "organizations_customer_id_key" ON "organizations"("customer_id");
