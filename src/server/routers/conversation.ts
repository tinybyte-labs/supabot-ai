import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { IpInfo, getIpInfo } from "../ipinfo";

export const conversationRouter = router({
  protectedGetById: protectedProcedure
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
      console.log({
        conversation,
        orgId: ctx.auth.orgId,
      });
      if (!conversation) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Conversation not found!",
        });
      }
      return conversation;
    }),
  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
        chatbotId: z.string(),
        userId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const conversation = await ctx.db.conversation.findUnique({
        where: { id: input.id, chatbotId: input.chatbotId },
      });
      if (!conversation || conversation.userId !== input.userId) {
        throw new TRPCError({
          code: "NOT_FOUND",
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
    .query(({ ctx, input }) => {
      return ctx.db.conversation.findMany({
        where: {
          chatbot: { id: input.chatbotId, organizationId: ctx.auth.orgId },
        },
        include: {
          user: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
    }),
});
