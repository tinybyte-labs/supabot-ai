-- AlterTable
ALTER TABLE "conversations" ADD COLUMN     "closed_at" TIMESTAMP(3),
ADD COLUMN     "ip_address" TEXT,
ADD COLUMN     "ip_info" JSONB;
