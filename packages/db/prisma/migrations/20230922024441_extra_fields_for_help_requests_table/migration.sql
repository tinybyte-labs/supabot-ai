-- CreateEnum
CREATE TYPE "HelpRequestPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- AlterTable
ALTER TABLE "help_requests" ADD COLUMN     "priority" "HelpRequestPriority" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "resolved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "resolvedBy" TEXT;

-- AddForeignKey
ALTER TABLE "help_requests" ADD CONSTRAINT "help_requests_resolvedBy_fkey" FOREIGN KEY ("resolvedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
