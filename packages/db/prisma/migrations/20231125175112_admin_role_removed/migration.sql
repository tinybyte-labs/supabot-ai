/*
  Warnings:

  - The values [ADMIN] on the enum `OrganizationMembershipRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrganizationMembershipRole_new" AS ENUM ('OWNER', 'MEMBER');
ALTER TABLE "OrganizationMembership" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "OrganizationMembership" ALTER COLUMN "role" TYPE "OrganizationMembershipRole_new" USING ("role"::text::"OrganizationMembershipRole_new");
ALTER TYPE "OrganizationMembershipRole" RENAME TO "OrganizationMembershipRole_old";
ALTER TYPE "OrganizationMembershipRole_new" RENAME TO "OrganizationMembershipRole";
DROP TYPE "OrganizationMembershipRole_old";
ALTER TABLE "OrganizationMembership" ALTER COLUMN "role" SET DEFAULT 'MEMBER';
COMMIT;
