/*
  Warnings:

  - The values [QUEUE] on the enum `LinkStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "LinkStatus_new" AS ENUM ('QUEUED', 'TRAINING', 'TRAINED', 'ERROR', 'CANCELED');
ALTER TABLE "Link" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Link" ALTER COLUMN "status" TYPE "LinkStatus_new" USING ("status"::text::"LinkStatus_new");
ALTER TYPE "LinkStatus" RENAME TO "LinkStatus_old";
ALTER TYPE "LinkStatus_new" RENAME TO "LinkStatus";
DROP TYPE "LinkStatus_old";
ALTER TABLE "Link" ALTER COLUMN "status" SET DEFAULT 'QUEUED';
COMMIT;

-- AlterTable
ALTER TABLE "Link" ALTER COLUMN "status" SET DEFAULT 'QUEUED';
