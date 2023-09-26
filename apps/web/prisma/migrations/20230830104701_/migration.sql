-- AlterTable
ALTER TABLE "Chatbot" ADD COLUMN     "fontSize" INTEGER NOT NULL DEFAULT 16,
ADD COLUMN     "placeholderText" VARCHAR(32),
ADD COLUMN     "primaryColor" VARCHAR(32),
ADD COLUMN     "welcomeMessage" VARCHAR(300);
