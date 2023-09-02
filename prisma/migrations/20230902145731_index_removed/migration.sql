/*
  Warnings:

  - You are about to drop the `organization_members` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `organizations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "chatbots" DROP CONSTRAINT "chatbots_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "organization_members" DROP CONSTRAINT "organization_members_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "organization_members" DROP CONSTRAINT "organization_members_userId_fkey";

-- DropTable
DROP TABLE "organization_members";

-- DropTable
DROP TABLE "organizations";

-- DropTable
DROP TABLE "users";

-- CreateIndex
CREATE INDEX "chatbots_name_idx" ON "chatbots"("name");

-- CreateIndex
CREATE INDEX "documents_updated_at_idx" ON "documents"("updated_at");

-- CreateIndex
CREATE INDEX "links_updated_at_idx" ON "links"("updated_at");

-- CreateIndex
CREATE INDEX "quick_prompts_title_idx" ON "quick_prompts"("title");
