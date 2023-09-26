-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateEnum
CREATE TYPE "LinkStatus" AS ENUM ('QUEUE', 'TRAINING', 'TRAINED', 'ERROR', 'CANCELED');

-- CreateEnum
CREATE TYPE "QuickPromptStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'UNPUBLISHED');

-- CreateTable
CREATE TABLE "Chatbot" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(32) NOT NULL,
    "slug" VARCHAR(32) NOT NULL,
    "description" VARCHAR(300),
    "image" TEXT,
    "metadata" JSONB,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "Chatbot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Link" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastTrainedAt" TIMESTAMP(3),
    "canceledAt" TIMESTAMP(3),
    "url" TEXT NOT NULL,
    "chatbotId" TEXT NOT NULL,
    "status" "LinkStatus" NOT NULL DEFAULT 'QUEUE',
    "error" TEXT,
    "metadata" JSONB,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "embedding" vector(1536) NOT NULL,
    "linkId" TEXT,
    "chatbotId" TEXT NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuickPrompt" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" VARCHAR(80) NOT NULL,
    "prompt" VARCHAR(500) NOT NULL,
    "chatbotId" TEXT NOT NULL,
    "metadata" JSONB,
    "status" "QuickPromptStatus" NOT NULL DEFAULT 'DRAFT',

    CONSTRAINT "QuickPrompt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Chatbot_slug_key" ON "Chatbot"("slug");

-- CreateIndex
CREATE INDEX "Chatbot_organizationId_idx" ON "Chatbot"("organizationId");

-- CreateIndex
CREATE INDEX "Chatbot_updatedAt_idx" ON "Chatbot"("updatedAt");

-- CreateIndex
CREATE INDEX "Chatbot_name_idx" ON "Chatbot"("name");

-- CreateIndex
CREATE INDEX "Link_updatedAt_idx" ON "Link"("updatedAt");

-- CreateIndex
CREATE INDEX "Link_lastTrainedAt_idx" ON "Link"("lastTrainedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Link_chatbotId_url_key" ON "Link"("chatbotId", "url");

-- CreateIndex
CREATE INDEX "Document_updatedAt_idx" ON "Document"("updatedAt");

-- CreateIndex
CREATE INDEX "QuickPrompt_updatedAt_idx" ON "QuickPrompt"("updatedAt");

-- CreateIndex
CREATE INDEX "QuickPrompt_title_idx" ON "QuickPrompt"("title");

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_chatbotId_fkey" FOREIGN KEY ("chatbotId") REFERENCES "Chatbot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_chatbotId_fkey" FOREIGN KEY ("chatbotId") REFERENCES "Chatbot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuickPrompt" ADD CONSTRAINT "QuickPrompt_chatbotId_fkey" FOREIGN KEY ("chatbotId") REFERENCES "Chatbot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
