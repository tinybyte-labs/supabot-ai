import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { IpInfo, getIpInfo } from "../ipinfo";

export const conversationRouter = router({
  getById: protectedProcedure
    .input(
      z.object({
        conversationId: z.string(),
        chatbotId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const conversation = await ctx.db.conversation.findFirst({
        where: {
          id: input.conversationId,
          chatbot: { id: input.chatbotId, organizationId: ctx.auth.orgId },
        },
        select: {
          id: true,
          title: true,
          ipInfo: true,
          url: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          userId: true,
          ipAddress: true,
          closedAt: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      });
      if (!conversation) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Conversation not found!",
        });
      }
      return conversation;
    }),
  create: publicProcedure
    .input(
      z.object({
        chatbotId: z.string(),
        userId: z.string().optional(),
        url: z.string().url().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let ipInfo: IpInfo | null = null;
      if (ctx.clientIp) {
        ipInfo = await getIpInfo(ctx.clientIp);
      }
      return ctx.db.conversation.create({
        data: {
          chatbotId: input.chatbotId,
          ...(input.userId ? { userId: input.userId } : {}),
          ...(input.url ? { url: input.url } : {}),
          ...(ipInfo ? { ipInfo } : {}),
          ...(ctx.clientIp ? { ipAddress: ctx.clientIp } : {}),
        },
      });
    }),
  list: protectedProcedure
    .input(
      z.object({
        chatbotId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const conversations = await ctx.db.conversation.findMany({
        where: {
          chatbot: { id: input.chatbotId, organizationId: ctx.auth.orgId },
        },
        select: {
          id: true,
          title: true,
          updatedAt: true,
          createdAt: true,
          status: true,
          messages: {
            select: {
              role: true,
              body: true,
            },
            orderBy: {
              updatedAt: "desc",
            },
            take: 1,
          },
          _count: {
            select: {
              messages: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
      return conversations.filter((conv) => conv._count.messages > 0);
    }),
  publicGetById: publicProcedure
    .input(
      z.object({
        conversationId: z.string(),
        chatbotId: z.string(),
        userId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const conversation = await ctx.db.conversation.findUnique({
        where: { id: input.conversationId, chatbotId: input.chatbotId },
      });
      if (
        !conversation ||
        (conversation.userId && conversation.userId !== input.userId)
      ) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Conversation not found!",
        });
      }
      return conversation;
    }),
  publicList: publicProcedure
    .input(
      z.object({
        chatbotId: z.string(),
        userId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const conversations = await ctx.db.conversation.findMany({
        where: {
          chatbotId: input.chatbotId,
          userId: input.userId,
        },
        select: {
          id: true,
          title: true,
          updatedAt: true,
          createdAt: true,
          status: true,
          messages: {
            select: {
              role: true,
              body: true,
            },
            orderBy: {
              updatedAt: "desc",
            },
            take: 1,
          },
          _count: {
            select: {
              messages: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
      return conversations.filter((conv) => conv._count.messages > 0);
    }),
  publicUpdate: publicProcedure
    .input(
      z.object({
        conversationId: z.string(),
        chatbotId: z.string(),
        userId: z.string().optional(),
        data: z.object({
          status: z.enum(["CLOSED"]).optional(),
        }),
      }),
    )
    .mutation(async (opts) => {
      const conversation = await opts.ctx.db.conversation.findFirst({
        where: {
          chatbotId: opts.input.chatbotId,
          id: opts.input.conversationId,
        },
      });
      if (
        !conversation ||
        (conversation.userId && conversation.userId !== opts.input.userId)
      ) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Conversation not found!",
        });
      }
      return opts.ctx.db.conversation.update({
        where: { id: opts.input.conversationId },
        data: {
          ...(opts.input.data.status ? { status: opts.input.data.status } : {}),
        },
      });
    }),
});
