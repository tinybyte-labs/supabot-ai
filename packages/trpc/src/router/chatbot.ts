import { protectedProcedure, publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import * as z from "zod";
import {
  defaultChatbotSettings,
  updateChatbotSettingsValidator,
} from "@acme/core";
import { createChatbotValidator, updateChatbotValidator } from "@acme/core";
import { hasUserAccessToChatbot, hasUserAccessToOrganization } from "./utils";

export const chatbotRouter = router({
  getAllChatbotsForOrganization: protectedProcedure
    .input(z.object({ orgSlug: z.string() }))
    .query(async ({ ctx, input }) => {
      const { organization } = await hasUserAccessToOrganization(
        input.orgSlug,
        ctx,
      );
      return ctx.db.chatbot.findMany({
        where: {
          organization: {
            id: organization.id,
          },
        },
        orderBy: { updatedAt: "desc" },
      });
    }),
  getChatbotById: publicProcedure
    .input(z.object({ chatbotId: z.string() }))
    .query(async ({ ctx, input }) => {
      const chatbot = await ctx.db.chatbot.findUnique({
        where: { id: input.chatbotId },
      });
      if (!chatbot) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chatbot not found!",
        });
      }
      return chatbot;
    }),
  createChatbot: protectedProcedure
    .input(createChatbotValidator)
    .mutation(async ({ ctx, input }) => {
      const { organization, plan } = await hasUserAccessToOrganization(
        input.orgSlug,
        ctx,
      );

      const chatbotsLimit = plan.limits.chatbots;

      if (chatbotsLimit !== "unlimited") {
        const chatbotsCount = await ctx.db.chatbot.count({
          where: { organizationId: organization.id },
        });
        if (chatbotsCount >= chatbotsLimit) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You reached your chatbot limits.",
          });
        }
      }

      const newChatbot = await ctx.db.chatbot.create({
        data: {
          name: input.name,
          organizationId: organization.id,
          settings: defaultChatbotSettings,
        },
      });

      return newChatbot;
    }),
  updateChatbot: protectedProcedure
    .input(updateChatbotValidator)
    .mutation(async (opts) => {
      const { chatbot } = await hasUserAccessToChatbot(opts.input.id, opts.ctx);

      const updatedChatbot = await opts.ctx.db.chatbot.update({
        where: { id: chatbot.id },
        data: {
          name: opts.input.name,
          image: opts.input.image,
        },
      });

      return updatedChatbot;
    }),
  updateChatbotSettings: protectedProcedure
    .input(updateChatbotSettingsValidator)
    .mutation(async (opts) => {
      const { chatbot } = await hasUserAccessToChatbot(opts.input.id, opts.ctx);

      const updatedChatbot = await opts.ctx.db.chatbot.update({
        where: { id: chatbot.id },
        data: {
          settings: opts.input.settings,
        },
      });

      return updatedChatbot;
    }),
  deleteChatbot: protectedProcedure
    .input(z.object({ chatbotId: z.string() }))
    .mutation(async (otps) => {
      const { chatbot } = await hasUserAccessToChatbot(
        otps.input.chatbotId,
        otps.ctx,
        ["OWNER", "ADMIN"],
      );

      const deletedChatbot = await otps.ctx.db.chatbot.delete({
        where: { id: chatbot.id },
      });

      return deletedChatbot;
    }),
  getStatsForChatbot: protectedProcedure
    .input(z.object({ chatbotId: z.string() }))
    .query(async (opts) => {
      const { chatbot } = await hasUserAccessToChatbot(
        opts.input.chatbotId,
        opts.ctx,
      );

      const linkCountPromise = opts.ctx.db.link.count({
        where: { chatbotId: chatbot.id },
      });
      const quickPromptCountPromise = opts.ctx.db.quickPrompt.count({
        where: { chatbotId: chatbot.id },
      });
      const userCountCountPromise = opts.ctx.db.chatbotUser.count({
        where: { chatbotId: chatbot.id },
      });
      const conversationCountPromise = opts.ctx.db.conversation.count({
        where: { chatbotId: chatbot.id },
      });
      const documentCountPromise = opts.ctx.db.document.count({
        where: { chatbotId: chatbot.id },
      });
      const messageLikeCountPromise = opts.ctx.db.message.count({
        where: {
          conversation: {
            chatbotId: chatbot.id,
          },
          reaction: "LIKE",
        },
      });
      const messageDislikeCountPromise = opts.ctx.db.message.count({
        where: {
          conversation: {
            chatbotId: chatbot.id,
          },
          reaction: "DISLIKE",
        },
      });

      const [
        linkCount,
        quickPromptCount,
        userCount,
        conversationCount,
        documentCount,
        messageLikeCount,
        messageDislikeCount,
      ] = await Promise.all([
        linkCountPromise,
        quickPromptCountPromise,
        userCountCountPromise,
        conversationCountPromise,
        documentCountPromise,
        messageLikeCountPromise,
        messageDislikeCountPromise,
      ]);

      return {
        linkCount,
        quickPromptCount,
        userCount,
        conversationCount,
        documentCount,
        messageLikeCount,
        messageDislikeCount,
      };
    }),
});
