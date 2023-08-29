import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

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
    .mutation(({ ctx, input }) => {
      return ctx.db.conversation.create({
        data: {
          chatbotId: input.chatbotId,
          ...(input.userId ? { userId: input.userId } : {}),
          ...(input.url ? { url: input.url } : {}),
        },
      });
    }),
});
