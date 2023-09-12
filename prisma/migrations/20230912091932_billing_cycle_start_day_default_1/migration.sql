/*
  Warnings:

  - Made the column `billing_cycle_start_day` on table `organizations` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "organizations" ALTER COLUMN "billing_cycle_start_day" SET NOT NULL,
ALTER COLUMN "billing_cycle_start_day" SET DEFAULT 1;
