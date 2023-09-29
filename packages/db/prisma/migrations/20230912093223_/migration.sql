/*
  Warnings:

  - You are about to drop the column `billing_cycle_start_day` on the `organizations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "organizations" DROP COLUMN "billing_cycle_start_day";
