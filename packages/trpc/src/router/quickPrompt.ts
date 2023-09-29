import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import {
  createQuickPromptValidator,
  updateQuickPromptValidator,
} from "@acme/core";
import "@clerk/nextjs/api";

export const quickPromptRouter = router({
  list: publicProcedure
    .input(
      z.object({
        chatbotId: z.string(),
      }),
    )
    .query(({ ctx, input: { chatbotId } }) => {
      return ctx.db.quickPrompt.findMany({
        where: { chatbot: { id: chatbotId } },
        orderBy: {
          updatedAt: "desc",
        },
      });
    }),
  create: protectedProcedure
    .input(createQuickPromptValidator)
    .mutation(async ({ ctx, input: { chatbotId, ...data } }) => {
      const chatbot = await ctx.db.chatbot.findFirst({
        where: { id: chatbotId, organizationId: ctx.auth.orgId },
        select: { id: true },
      });
      if (!chatbot) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chatbot not found!",
        });
      }
      return ctx.db.quickPrompt.create({ data: { chatbotId, ...data } });
    }),
  update: protectedProcedure
    .input(updateQuickPromptValidator)
    .mutation(async ({ ctx, input: { id, ...data } }) => {
      const quickPrompt = await ctx.db.quickPrompt.findFirst({
        where: { id, chatbot: { organizationId: ctx.auth.orgId } },
      });
      if (!quickPrompt) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Quick Prompt not found!",
        });
      }
      return ctx.db.quickPrompt.update({ where: { id }, data });
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const quickPrompt = await ctx.db.quickPrompt.findFirst({
        where: { id: input, chatbot: { organizationId: ctx.auth.orgId } },
      });
      if (!quickPrompt) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Quick Prompt not found!",
        });
      }
      return ctx.db.quickPrompt.delete({ where: { id: input } });
    }),
  deleteMany: protectedProcedure
    .input(z.string().array())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.quickPrompt.deleteMany({
        where: {
          id: { in: input },
          chatbot: { organizationId: ctx.auth.orgId },
        },
      });
    }),
});
