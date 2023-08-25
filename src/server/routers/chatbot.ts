import { Prisma } from "@prisma/client";
import { prisma } from "../prisma";
import { protectedProcedure, router } from "../trpc";
import { createChatbotValidator } from "@/utils/validators";
import { TRPCError } from "@trpc/server";

const chatbotListSelect = Prisma.validator<Prisma.ChatbotSelect>()({
  id: true,
  slug: true,
  name: true,
  createdAt: true,
  updatedAt: true,
  image: true,
  organizationId: true,
});

export const chatbotRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const chatbots = await prisma.chatbot.findMany({
      where: { organizationId: ctx.auth.orgId },
      orderBy: { updatedAt: "desc" },
      select: chatbotListSelect,
    });
    return chatbots;
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
      const alreadyExists = await prisma.chatbot.findUnique({
        where: { slug: input.slug },
        select: { slug: true },
      });
      if (alreadyExists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Slug is already taken",
        });
      }
      return prisma.chatbot.create({
        data: {
          name: input.name,
          slug: input.slug,
          organizationId: ctx.auth.orgId,
          metadata: { createdBy: ctx.auth.userId },
        },
      });
    }),
});
