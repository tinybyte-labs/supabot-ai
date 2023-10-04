import { protectedProcedure, publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import * as z from "zod";
import { defaultChatbotSettings } from "@acme/core";
import { plans } from "@acme/plans";
import { createChatbotValidator, updateChatbotValidator } from "@acme/core";

export const chatbotRouter = router({
  list: protectedProcedure
    .input(z.object({ orgSlug: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.chatbot.findMany({
        where: {
          organization: {
            slug: input.orgSlug,
            members: {
              some: {
                userId: ctx.session.user.id,
              },
            },
          },
        },
        orderBy: { updatedAt: "desc" },
      });
    }),
  stats: protectedProcedure
    .input(
      z.object({
        chatbotId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const chatbot = await ctx.db.chatbot.findUnique({
        where: {
          id: input.chatbotId,
          organization: {
            members: {
              some: {
                userId: ctx.session.user.id,
              },
            },
          },
        },
        select: {
          id: true,
          _count: {
            select: {
              links: true,
              quickPrompts: true,
              conversations: true,
              users: true,
              documents: true,
            },
          },
        },
      });

      if (!chatbot) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chatbot not found!",
        });
      }

      const messageLikeCountPromise = ctx.db.message.count({
        where: {
          conversation: {
            chatbotId: chatbot.id,
          },
          reaction: "LIKE",
        },
      });

      const messageDislikeCountPromise = ctx.db.message.count({
        where: {
          conversation: {
            chatbotId: chatbot.id,
          },
          reaction: "DISLIKE",
        },
      });

      const [messageLikeCount, messageDislikeCount] = await Promise.all([
        messageLikeCountPromise,
        messageDislikeCountPromise,
      ]);

      return {
        linksCount: chatbot?._count.links || 0,
        quickPromptCount: chatbot?._count.quickPrompts || 0,
        userCount: chatbot?._count.users || 0,
        conversationCount: chatbot?._count.conversations || 0,
        documentCount: chatbot?._count.documents || 0,
        messageLikeCount,
        messageDislikeCount,
      };
    }),
  findById: publicProcedure
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
  create: protectedProcedure
    .input(createChatbotValidator)
    .mutation(async ({ ctx, input }) => {
      const organization = await ctx.db.organization.findUnique({
        where: {
          slug: input.orgSlug,
          members: { some: { userId: ctx.session.user.id } },
        },
        select: {
          id: true,
          plan: true,
        },
      });
      if (!organization) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Organization not found!",
        });
      }
      const plan = plans.find((plan) => plan.id === organization.plan);
      if (!plan) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No subscription plan found! Please subscribe to a plan",
        });
      }
      if (plan.limits.chatbots !== "unlimited") {
        const chatbotsCount = await ctx.db.chatbot.count({
          where: { organizationId: organization.id },
        });
        if (chatbotsCount >= plan.limits.chatbots) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Chatbot creation limit riched",
          });
        }
      }
      return ctx.db.chatbot.create({
        data: {
          name: input.name,
          organizationId: organization.id,
          settings: defaultChatbotSettings,
        },
      });
    }),
  update: protectedProcedure
    .input(updateChatbotValidator)
    .mutation(async ({ ctx, input: { id, ...data } }) => {
      return ctx.db.chatbot.update({
        where: {
          id,
          organization: { members: { some: { userId: ctx.session.user.id } } },
        },
        data,
      });
    }),
  delete: protectedProcedure
    .input(z.object({ chatbotId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.chatbot.delete({
        where: {
          id: input.chatbotId,
          organization: { members: { some: { userId: ctx.session.user.id } } },
        },
      });
    }),
});
