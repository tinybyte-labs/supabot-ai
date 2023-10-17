import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import {
  createQuickPromptValidator,
  updateQuickPromptValidator,
} from "@acme/core/validators";

export const quickPromptRouter = router({
  list: publicProcedure
    .input(z.object({ chatbotId: z.string() }))
    .query(async ({ ctx, input: { chatbotId } }) => {
      const chatbot = await ctx.db.chatbot.findFirst({
        where: { id: chatbotId },
        select: { id: true },
      });
      if (!chatbot) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chatbot not found!",
        });
      }
      return ctx.db.quickPrompt.findMany({
        where: { chatbot: { id: chatbot.id } },
        orderBy: {
          updatedAt: "desc",
        },
      });
    }),
  create: protectedProcedure
    .input(createQuickPromptValidator)
    .mutation(async ({ ctx, input: { chatbotId, ...data } }) => {
      const chatbot = await ctx.db.chatbot.findFirst({
        where: {
          id: chatbotId,
          organization: { members: { some: { userId: ctx.session.user.id } } },
        },
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
        where: {
          id,
          chatbot: {
            organization: {
              members: { some: { userId: ctx.session.user.id } },
            },
          },
        },
        select: { id: true },
      });
      if (!quickPrompt) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Quick Prompt not found!",
        });
      }
      return ctx.db.quickPrompt.update({ where: { id: quickPrompt.id }, data });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const quickPrompt = await ctx.db.quickPrompt.findFirst({
        where: {
          id: input.id,
          chatbot: {
            organization: {
              members: { some: { userId: ctx.session.user.id } },
            },
          },
        },
        select: { id: true },
      });
      if (!quickPrompt) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Quick Prompt not found!",
        });
      }
      return ctx.db.quickPrompt.delete({ where: { id: quickPrompt.id } });
    }),
  deleteMany: protectedProcedure
    .input(z.object({ ids: z.string().array() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.quickPrompt.deleteMany({
        where: {
          id: { in: input.ids },
          chatbot: {
            organization: {
              members: { some: { userId: ctx.session.user.id } },
            },
          },
        },
      });
    }),
});
