import { protectedProcedure, router } from "../trpc";
import { createChatbotValidator } from "@/utils/validators";
import { TRPCError } from "@trpc/server";
import * as z from "zod";

export const chatbotRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.chatbot.findMany({
      where: { organizationId: ctx.auth.orgId },
      orderBy: { updatedAt: "desc" },
    });
  }),
  findBySlug: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.chatbot.findUnique({
        where: { organizationId: ctx.auth.orgId, slug: input },
      });
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
});
