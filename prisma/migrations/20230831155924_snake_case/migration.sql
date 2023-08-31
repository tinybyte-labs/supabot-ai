/*
  Warnings:

  - You are about to drop the `Chatbot` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChatbotUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Conversation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Document` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Link` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuickPrompt` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "link_status" AS ENUM ('queued', 'training', 'trained', 'error', 'canceled');

-- CreateEnum
CREATE TYPE "quick_prompt_status" AS ENUM ('published', 'unpublished');

-- CreateEnum
CREATE TYPE "conversation_status" AS ENUM ('open', 'closed');

-- CreateEnum
CREATE TYPE "message_role" AS ENUM ('bot', 'user');

-- CreateEnum
CREATE TYPE "reaction" AS ENUM ('like', 'dislike');

-- DropForeignKey
ALTER TABLE "ChatbotUser" DROP CONSTRAINT "ChatbotUser_chatbotId_fkey";

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_chatbotId_fkey";

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_userId_fkey";

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_chatbotId_fkey";

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_linkId_fkey";

-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_chatbotId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_userId_fkey";

-- DropForeignKey
ALTER TABLE "QuickPrompt" DROP CONSTRAINT "QuickPrompt_chatbotId_fkey";

-- DropTable
DROP TABLE "Chatbot";

-- DropTable
DROP TABLE "ChatbotUser";

-- DropTable
DROP TABLE "Conversation";

-- DropTable
DROP TABLE "Document";

-- DropTable
DROP TABLE "Link";

-- DropTable
DROP TABLE "Message";

-- DropTable
DROP TABLE "QuickPrompt";

-- DropEnum
DROP TYPE "ConversationStatus";

-- DropEnum
DROP TYPE "LinkStatus";

-- DropEnum
DROP TYPE "MessageRole";

-- DropEnum
DROP TYPE "QuickPromptStatus";

-- DropEnum
DROP TYPE "Reaction";

-- CreateTable
CREATE TABLE "chatbots" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(32) NOT NULL,
    "slug" VARCHAR(32) NOT NULL,
    "image" TEXT,
    "metadata" JSONB,
    "organization_id" TEXT NOT NULL,
    "settings" JSONB,

    CONSTRAINT "chatbots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "links" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_trained_at" TIMESTAMP(3),
    "canceled_at" TIMESTAMP(3),
    "url" TEXT NOT NULL,
    "chatbot_id" TEXT NOT NULL,
    "status" "link_status" NOT NULL DEFAULT 'queued',
    "error" TEXT,
    "metadata" JSONB,

    CONSTRAINT "links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "embedding" vector(1536),
    "link_id" TEXT,
    "chatbot_id" TEXT NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quick_prompts" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "title" VARCHAR(80) NOT NULL,
    "prompt" VARCHAR(500) NOT NULL,
    "chatbot_id" TEXT NOT NULL,
    "metadata" JSONB,
    "status" "quick_prompt_status" NOT NULL DEFAULT 'published',
    "is_follow_up_prompt" BOOLEAN NOT NULL DEFAULT false,
    "is_escalation_prompt" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "quick_prompts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chatbot_users" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "chatbot_id" TEXT NOT NULL,

    CONSTRAINT "chatbot_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "title" TEXT,
    "status" "conversation_status" NOT NULL DEFAULT 'open',
    "url" TEXT,
    "chatbot_id" TEXT NOT NULL,
    "user_id" TEXT,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "body" TEXT NOT NULL,
    "role" "message_role" NOT NULL,
    "reaction" "reaction",
    "conversation_id" TEXT NOT NULL,
    "user_id" TEXT,
    "metadata" JSONB,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "chatbots_slug_key" ON "chatbots"("slug");

-- CreateIndex
CREATE INDEX "chatbots_organization_id_idx" ON "chatbots"("organization_id");

-- CreateIndex
CREATE INDEX "chatbots_updated_at_idx" ON "chatbots"("updated_at");

-- CreateIndex
CREATE INDEX "chatbots_name_idx" ON "chatbots"("name");

-- CreateIndex
CREATE INDEX "links_updated_at_idx" ON "links"("updated_at");

-- CreateIndex
CREATE INDEX "links_last_trained_at_idx" ON "links"("last_trained_at");

-- CreateIndex
CREATE UNIQUE INDEX "links_chatbot_id_url_key" ON "links"("chatbot_id", "url");

-- CreateIndex
CREATE INDEX "documents_updated_at_idx" ON "documents"("updated_at");

-- CreateIndex
CREATE INDEX "quick_prompts_updated_at_idx" ON "quick_prompts"("updated_at");

-- CreateIndex
CREATE INDEX "quick_prompts_title_idx" ON "quick_prompts"("title");

-- CreateIndex
CREATE UNIQUE INDEX "chatbot_users_chatbot_id_email_key" ON "chatbot_users"("chatbot_id", "email");

-- AddForeignKey
ALTER TABLE "links" ADD CONSTRAINT "links_chatbot_id_fkey" FOREIGN KEY ("chatbot_id") REFERENCES "chatbots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_link_id_fkey" FOREIGN KEY ("link_id") REFERENCES "links"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_chatbot_id_fkey" FOREIGN KEY ("chatbot_id") REFERENCES "chatbots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quick_prompts" ADD CONSTRAINT "quick_prompts_chatbot_id_fkey" FOREIGN KEY ("chatbot_id") REFERENCES "chatbots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chatbot_users" ADD CONSTRAINT "chatbot_users_chatbot_id_fkey" FOREIGN KEY ("chatbot_id") REFERENCES "chatbots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_chatbot_id_fkey" FOREIGN KEY ("chatbot_id") REFERENCES "chatbots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "chatbot_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "chatbot_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
