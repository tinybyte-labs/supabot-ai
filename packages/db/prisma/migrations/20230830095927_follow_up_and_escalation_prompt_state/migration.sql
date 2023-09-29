-- AlterTable
ALTER TABLE "QuickPrompt" ADD COLUMN     "isEscalationPrompt" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isFollowUpPrompt" BOOLEAN NOT NULL DEFAULT false;
