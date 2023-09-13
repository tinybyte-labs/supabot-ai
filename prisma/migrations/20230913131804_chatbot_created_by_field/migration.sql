-- AlterTable
ALTER TABLE "chatbots" ADD COLUMN     "created_by" TEXT;

-- AddForeignKey
ALTER TABLE "chatbots" ADD CONSTRAINT "chatbots_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
