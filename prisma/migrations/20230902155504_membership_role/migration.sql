/*
  Warnings:

  - Added the required column `role` to the `organization_memberships` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "organization_memberships" ADD COLUMN     "role" TEXT NOT NULL;
