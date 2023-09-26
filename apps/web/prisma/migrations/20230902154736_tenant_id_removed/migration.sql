/*
  Warnings:

  - You are about to drop the column `tenant_id` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_tenant_id_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "tenant_id";
