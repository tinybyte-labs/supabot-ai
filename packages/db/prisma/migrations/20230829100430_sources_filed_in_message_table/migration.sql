-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "url" TEXT;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "sources" TEXT[];
