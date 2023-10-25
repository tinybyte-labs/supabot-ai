import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const conversationRouter = createTRPCRouter({
  startConversation: publicProcedure
    .input(
      z.object({
        name: z.string().max(100),
        email: z.string().email(),
        chatbotId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.chatbotUser.upsert({
        create: {
          chatbotId: input.chatbotId,
          email: input.email,
          name: input.name,
        },
        update: {
          name: input.name,
        },
        where: {
          chatbotId_email: {
            chatbotId: input.chatbotId,
            email: input.email,
          },
        },
      });
      const conversation = await ctx.db.conversation.create({
        data: {
          chatbotId: input.chatbotId,
          userId: user.id,
        },
      });
      return conversation;
    }),
  getAllMessages: publicProcedure
    .input(z.object({ conversationId: z.string() }))
    .query(async ({ ctx, input }) => {
      const conversation = await ctx.db.conversation.findUnique({
        where: { id: input.conversationId },
      });
      if (!conversation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Conversation not found!",
        });
      }
      const messages = await ctx.db.message.findMany({
        where: { conversationId: conversation.id },
        orderBy: {
          createdAt: "desc",
        },
      });

      return messages;
    }),
});
