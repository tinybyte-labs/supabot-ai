import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

export const chatbotRouter = createTRPCRouter({
  getById: publicProcedure
    .input(
      z.object({
        chatbotId: z.string(),
      }),
    )
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
});
