import { protectedProcedure, publicProcedure, router } from "../trpc";
import {
  createChatbotValidator,
  updateChatbotValidator,
} from "@/utils/validators";
import { TRPCError } from "@trpc/server";
import * as z from "zod";

export const chatbotRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.chatbot.findMany({
      where: { organizationId: ctx.auth.orgId },
      orderBy: { updatedAt: "desc" },
    });
  }),
  stats: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const chatbot = await ctx.db.chatbot.findUnique({
      where: { id: input, organizationId: ctx.auth.orgId },
      select: {
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
      throw new TRPCError({ code: "NOT_FOUND", message: "Chatbot not found!" });
    }

    const messageLikeCountPromise = ctx.db.message.count({
      where: {
        conversation: {
          chatbotId: input,
        },
        reaction: "LIKE",
      },
    });

    const messageDislikeCountPromise = ctx.db.message.count({
      where: {
        conversation: {
          chatbotId: input,
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
  findBySlug: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const chatbot = await ctx.db.chatbot.findUnique({
        where: { slug: input },
      });
      if (!chatbot) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chatbot not found!",
        });
      }
      return chatbot;
    }),
  findById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const chatbot = await ctx.db.chatbot.findUnique({
      where: { id: input },
    });
    if (!chatbot) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Chatbot not found!" });
    }
    return chatbot;
  }),
  create: protectedProcedure
    .input(createChatbotValidator)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.auth.orgId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No organization selected",
        });
      }
      const alreadyExists = await ctx.db.chatbot.findUnique({
        where: { slug: input.slug },
        select: { slug: true },
      });
      if (alreadyExists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Slug is already taken",
        });
      }
      return ctx.db.chatbot.create({
        data: {
          name: input.name,
          slug: input.slug,
          organizationId: ctx.auth.orgId,
          metadata: { createdBy: ctx.auth.userId },
        },
      });
    }),
  update: protectedProcedure
    .input(updateChatbotValidator)
    .mutation(async ({ ctx, input: { id, ...data } }) => {
      if (!ctx.auth.orgId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No organization selected",
        });
      }
      const chatbot = await ctx.db.chatbot.findUnique({
        where: { id, organizationId: ctx.auth.orgId },
      });
      if (!chatbot) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chatbot not found!",
        });
      }
      if (data.slug) {
        const alreadyExists = await ctx.db.chatbot.findUnique({
          where: { slug: data.slug },
          select: { slug: true },
        });
        if (alreadyExists) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Slug is already taken",
          });
        }
      }
      return ctx.db.chatbot.update({
        where: { id },
        data,
      });
    }),
  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.chatbot.delete({
      where: { id: input, organizationId: ctx.auth.orgId },
    });
  }),
});
