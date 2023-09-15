import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { IpInfo, getIpInfo } from "../ipinfo";

export const conversationRouter = router({
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
      if (!conversation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Conversation not found!",
        });
      }
      if (conversation.userId && conversation.userId !== input.userId) {
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
