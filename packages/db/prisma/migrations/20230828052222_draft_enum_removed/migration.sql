/*
  Warnings:

  - The values [DRAFT] on the enum `QuickPromptStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "QuickPromptStatus_new" AS ENUM ('PUBLISHED', 'UNPUBLISHED');
ALTER TABLE "QuickPrompt" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "QuickPrompt" ALTER COLUMN "status" TYPE "QuickPromptStatus_new" USING ("status"::text::"QuickPromptStatus_new");
ALTER TYPE "QuickPromptStatus" RENAME TO "QuickPromptStatus_old";
ALTER TYPE "QuickPromptStatus_new" RENAME TO "QuickPromptStatus";
DROP TYPE "QuickPromptStatus_old";
ALTER TABLE "QuickPrompt" ALTER COLUMN "status" SET DEFAULT 'PUBLISHED';
COMMIT;

-- AlterTable
ALTER TABLE "QuickPrompt" ALTER COLUMN "status" SET DEFAULT 'PUBLISHED';
