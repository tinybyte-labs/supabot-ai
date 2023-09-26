/*
  Warnings:

  - You are about to drop the column `photo_url` on the `organizations` table. All the data in the column will be lost.
  - You are about to drop the column `photo_url` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `organization_members` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "organization_members" DROP CONSTRAINT "organization_members_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "organization_members" DROP CONSTRAINT "organization_members_userId_fkey";

-- AlterTable
ALTER TABLE "organizations" DROP COLUMN "photo_url",
ADD COLUMN     "created_by" TEXT,
ADD COLUMN     "image_url" TEXT,
ADD COLUMN     "logo_url" TEXT,
ADD COLUMN     "public_metadata" JSONB;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "photo_url",
ADD COLUMN     "image_url" TEXT,
ADD COLUMN     "last_sign_in_at" TIMESTAMP(3),
ADD COLUMN     "profile_image_url" TEXT,
ADD COLUMN     "public_metadata" JSONB;

-- DropTable
DROP TABLE "organization_members";

-- CreateTable
CREATE TABLE "organization_memberships" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "organization_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organization_memberships_userId_organizationId_key" ON "organization_memberships"("userId", "organizationId");

-- AddForeignKey
ALTER TABLE "organization_memberships" ADD CONSTRAINT "organization_memberships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_memberships" ADD CONSTRAINT "organization_memberships_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
